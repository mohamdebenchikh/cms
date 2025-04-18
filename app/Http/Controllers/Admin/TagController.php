<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use App\Http\Requests\StoreTagRequest;
use App\Http\Requests\UpdateTagRequest;
use App\Services\DataTableService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Tag::class);

        // Create a query with eager loading
        $query = Tag::withCount('posts');

        // Create a new DataTableService instance
        $dataTable = new DataTableService($query, $request);

        // Configure the DataTable service
        $dataTable->setDefaultSortField('name')
            ->setDefaultSortDirection('asc')
            ->setDefaultPerPage(10)
            ->setSearchableFields(['name', 'slug']);

        // Process the query and get results
        $result = $dataTable->process();

        return Inertia::render('admin/tags/index', [
            'tags' => $result['data'],
            'filters' => $result['filters']
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * Note: This method is no longer used as we're using a dialog for creating tags,
     * but we're keeping it for API compatibility.
     */
    public function create()
    {
        $this->authorize('create', Tag::class);

        return redirect()->route('admin.tags.index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTagRequest $request)
    {
        $this->authorize('create', Tag::class);

        $tag = Tag::create($request->validated());

        // Check if request explicitly wants JSON (from axios/fetch API calls)
        // This handles requests from the tag-input component
        if ($request->header('X-Requested-With') === 'XMLHttpRequest' &&
            $request->header('Accept') &&
            str_contains($request->header('Accept'), 'application/json')) {

            return response()->json([
                'success' => true,
                'message' => 'Tag created successfully.',
                'tag' => $tag
            ]);
        }

        // Handle Inertia requests (from the tag form dialog)
        // This ensures we redirect back with a success message
        if ($request->header('X-Inertia')) {
            if ($request->wantsJson()) {
                // For Inertia form submissions that expect JSON (like tag-form-dialog)
                return redirect()->route('admin.tags.index')
                    ->with('success', 'Tag created successfully.');
            }

            // For Inertia requests that need the tag in flash data
            return redirect()->back()->with('tag', $tag);
        }

        // Regular form submission
        return redirect()->route('admin.tags.index')
            ->with('success', 'Tag created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Tag $tag): Response
    {
        $this->authorize('view', $tag);

        return Inertia::render('admin/tags/show', [
            'tag' => $tag->load('posts'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * Note: This method is no longer used as we're using a dialog for editing tags,
     * but we're keeping it for API compatibility.
     */
    public function edit(Tag $tag)
    {
        $this->authorize('update', $tag);

        return redirect()->route('admin.tags.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTagRequest $request, Tag $tag)
    {
        $this->authorize('update', $tag);

        $tag->update($request->validated());

        // Check if request explicitly wants JSON (from axios/fetch API calls)
        if ($request->header('X-Requested-With') === 'XMLHttpRequest' &&
            $request->header('Accept') &&
            str_contains($request->header('Accept'), 'application/json')) {

            return response()->json([
                'success' => true,
                'message' => 'Tag updated successfully.',
                'tag' => $tag
            ]);
        }

        // Handle Inertia requests
        if ($request->header('X-Inertia')) {
            return redirect()->route('admin.tags.index')
                ->with('success', 'Tag updated successfully.');
        }

        // Regular form submission
        return redirect()->route('admin.tags.index')
            ->with('success', 'Tag updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tag $tag): RedirectResponse
    {
        $this->authorize('delete', $tag);

        // Detach any posts associated with this tag before deleting
        if ($tag->posts()->count() > 0) {
            Log::info('Detaching posts from tag before deletion: ' . $tag->name . ' (ID: ' . $tag->id . ')');
            $tag->posts()->detach();
        }

        $tag->delete();

        return redirect()->route('admin.tags.index')
            ->with('success', 'Tag deleted successfully.');
    }

    /**
     * Bulk delete multiple tags.
     */
    public function bulkDestroy(Request $request)
    {
        $this->authorize('viewAny', Tag::class);
        $this->authorize('delete', Tag::class);

        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|integer|exists:tags,id',
        ]);

        $tagIds = $request->ids;

        // Log the received IDs for debugging
        Log::info('Bulk delete request received for tag IDs:', $tagIds);

        // Get the tags to delete
        $tagsToDelete = Tag::whereIn('id', $tagIds)->get();

        // Log the tags found
        Log::info('Tags found for deletion: ' . $tagsToDelete->count());

        // Detach posts from tags that have them
        foreach ($tagsToDelete as $tag) {
            if ($tag->posts()->count() > 0) {
                Log::info('Detaching posts from tag before bulk deletion: ' . $tag->name . ' (ID: ' . $tag->id . ')');
                $tag->posts()->detach();
            }
        }

        // Delete the tags
        $deletedIds = [];
        foreach ($tagsToDelete as $tag) {
            Log::info('Deleting tag: ' . $tag->id . ' - ' . $tag->name);
            $deletedIds[] = $tag->id;
            $tag->delete();
        }

        // Log completion
        $deletedCount = count($deletedIds);
        Log::info('Bulk delete completed, deleted ' . $deletedCount . ' tags');

        // Return back with a success message
        return back()->with('success', $deletedCount . ' tags deleted successfully.');
    }
}
