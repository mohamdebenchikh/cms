<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Http\Requests\StorePageRequest;
use App\Http\Requests\UpdatePageRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Page::class);

        // Get filters from request
        $filters = $request->only(['search', 'sort_field', 'sort_direction', 'per_page', 'page', 'status']);
        $perPage = $filters['per_page'] ?? 10;
        $sortField = $filters['sort_field'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        $search = $filters['search'] ?? '';
        $status = $filters['status'] ?? null;

        // Build query
        $query = Page::with('user');

        // Apply search filter if provided
        if ($search) {
            $query->where(function ($query) use ($search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        // Apply status filter if provided
        if ($status) {
            $query->where('status', $status);
        }

        // Apply sorting
        $query->orderBy($sortField, $sortDirection);

        // Get paginated results
        $pages = $query->paginate($perPage)->withQueryString();

        return Inertia::render('admin/pages/index', [
            'pages' => $pages,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $this->authorize('create', Page::class);

        return Inertia::render('admin/pages/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePageRequest $request): RedirectResponse
    {
        $this->authorize('create', Page::class);

        $data = $request->validated();
        $data['user_id'] = Auth::id();

        Page::create($data);

        return redirect()->route('admin.pages.index')
            ->with('success', 'Page created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Page $page): Response
    {
        $this->authorize('view', $page);

        return Inertia::render('admin/pages/show', [
            'page' => $page->load('user'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Page $page): Response
    {
        $this->authorize('update', $page);

        return Inertia::render('admin/pages/edit', [
            'page' => $page,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePageRequest $request, Page $page): RedirectResponse
    {
        $this->authorize('update', $page);

        $page->update($request->validated());

        return redirect()->route('admin.pages.index')
            ->with('success', 'Page updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Page $page): RedirectResponse
    {
        $this->authorize('delete', $page);

        $page->delete();

        return redirect()->route('admin.pages.index')
            ->with('success', 'Page deleted successfully.');
    }

    /**
     * Remove multiple resources from storage.
     */
    public function bulkDestroy(Request $request): RedirectResponse
    {
        $this->authorize('viewAny', Page::class);

        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:pages,id',
        ]);

        $count = count($validated['ids']);

        // Delete each page after authorizing
        foreach ($validated['ids'] as $id) {
            $page = Page::findOrFail($id);
            $this->authorize('delete', $page);
            $page->delete();
        }

        return redirect()->route('admin.pages.index')
            ->with('success', $count . ' ' . ($count === 1 ? 'page' : 'pages') . ' deleted successfully.');
    }
}
