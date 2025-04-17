<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Category::class);

        $query = Category::with(['posts']);

        // Apply search filter
        if ($request->has('search') && $request->search !== '') {
            $query->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('slug', 'like', '%' . $request->search . '%');
        }

        // Apply sorting
        $sortField = $request->input('sort_field', 'name');
        $sortDirection = $request->input('sort_direction', 'asc');

        // Restrict sorting to allowed fields
        $allowedSortFields = ['name', 'slug', 'created_at', 'updated_at'];
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            // Default sorting
            $query->orderBy('name', 'asc');
        }

        // Paginate results
        $perPage = $request->input('per_page', 10);
        $categories = $query->paginate($perPage)->withQueryString();

        return Inertia::render('admin/categories/index', [
            'categories' => $categories,
            'filters' => [
                'search' => $request->search,
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * Note: This method is no longer used as we're using a dialog for creating categories,
     * but we're keeping it for API compatibility.
     */
    public function create()
    {
        $this->authorize('create', Category::class);

        return Inertia::render('admin/categories/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        $this->authorize('create', Category::class);

        // Get validated data
        $validatedData = $request->validated();

        // Check if image_cover column exists
        if (!Schema::hasColumn('categories', 'image_cover') && isset($validatedData['image_cover'])) {
            // Remove image_cover from validated data if the column doesn't exist
            unset($validatedData['image_cover']);
        }

        $category = Category::create($validatedData);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Category created successfully.',
                'category' => $category
            ]);
        }

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category): Response
    {
        $this->authorize('view', $category);

        return Inertia::render('admin/categories/show', [
            'category' => $category->load('posts'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * Note: This method is no longer used as we're using a dialog for editing categories,
     * but we're keeping it for API compatibility.
     */
    public function edit(Category $category)
    {
        $this->authorize('update', $category);

        return Inertia::render('admin/categories/edit', ['category' => $category]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $this->authorize('update', $category);

        // Get validated data
        $validatedData = $request->validated();

        // Check if image_cover column exists
        if (!Schema::hasColumn('categories', 'image_cover') && isset($validatedData['image_cover'])) {
            // Remove image_cover from validated data if the column doesn't exist
            unset($validatedData['image_cover']);
        }

        $category->update($validatedData);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Category updated successfully.',
                'category' => $category
            ]);
        }

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category): RedirectResponse
    {
        $this->authorize('delete', $category);

        // Check if category has posts before deleting
        if ($category->posts()->count() > 0) {
            // Update all posts to have null category_id
            Log::info('Updating posts for category before deletion: ' . $category->name . ' (ID: ' . $category->id . ')');
            $category->posts()->update(['category_id' => null]);
        }

        $category->delete();

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category deleted successfully.');
    }

    /**
     * Get all categories for dropdown.
     */
    public function getAllCategories(Request $request)
    {
        $this->authorize('viewAny', Category::class);

        $categories = Category::orderBy('name')
            ->when($request->has('exclude_id'), function($query) use ($request) {
                return $query->where('id', '!=', $request->exclude_id);
            })
            ->get();

        return response()->json([
            'categories' => $categories
        ]);
    }

    /**
     * Get main categories.
     */
    public function getMainCategories()
    {
        $mainCategories = Category::where('is_main', true)
            ->orderBy('name')
            ->get();

        return response()->json([
            'categories' => $mainCategories
        ]);
    }

    /**
     * Bulk delete categories.
     */
    public function bulkDestroy(Request $request)
    {
        $this->authorize('viewAny', Category::class);
        $this->authorize('delete', Category::class);

        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|integer|exists:categories,id',
        ]);

        $categoryIds = $request->ids;

        // Log the received IDs for debugging
        Log::info('Bulk delete request received for category IDs:', $categoryIds);

        // Get the categories to delete
        $categoriesToDelete = Category::whereIn('id', $categoryIds)->get();

        // Log the categories found
        Log::info('Categories found for deletion: ' . $categoriesToDelete->count());

        // Log categories with posts (but we'll delete them anyway)
        $categoriesWithPosts = $categoriesToDelete->filter(function ($category) {
            return $category->posts()->count() > 0;
        });

        if ($categoriesWithPosts->count() > 0) {
            $categoryNames = $categoriesWithPosts->pluck('name')->implode(', ');
            Log::info('Categories with posts that will be deleted: ' . $categoriesWithPosts->count() . ' (' . $categoryNames . ')');

            // For each category with posts, set the posts' category_id to null
            foreach ($categoriesWithPosts as $category) {
                Log::info('Updating posts for category: ' . $category->name . ' (ID: ' . $category->id . ')');
                // Update all posts to have null category_id
                $category->posts()->update(['category_id' => null]);
            }
        }

        // Delete the categories
        $deletedIds = [];
        foreach ($categoriesToDelete as $category) {
            Log::info('Deleting category: ' . $category->id . ' - ' . $category->name);
            $deletedIds[] = $category->id;
            $category->delete();
        }

        // Log completion
        $deletedCount = count($deletedIds);
        Log::info('Bulk delete completed, deleted ' . $deletedCount . ' categories');

        // Return back with a success message
        return back()->with('success', $deletedCount . ' categories deleted successfully.');
    }
}
