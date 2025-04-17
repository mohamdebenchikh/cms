<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Services\DataTableService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Post::class);

        // Create a query with eager loading
        $query = Post::with(['user', 'category']);

        // Create a DataTable service instance
        $dataTable = new DataTableService($query, $request);

        // Configure the DataTable service
        $dataTable->setDefaultSortField('created_at')
            ->setDefaultSortDirection('desc')
            ->setDefaultPerPage(10)
            ->setSearchableFields(['title', 'excerpt', 'content', 'user.name', 'category.name']);

        // Handle status filtering
        if ($request->has('status') && $request->input('status')) {
            $query->where('status', $request->input('status'));
        }

        // Handle category filtering
        if ($request->has('category_id') && $request->input('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        // Process the query and get results
        $result = $dataTable->process();

        // Get all categories for the filter dropdown
        $categories = Category::orderBy('name')->get();

        return Inertia::render('admin/posts/index', [
            'posts' => $result['data'],
            'filters' => $result['filters'],
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $this->authorize('create', Post::class);

        $categories = Category::orderBy('name')->get();
        $tags = Tag::orderBy('name')->get();

        return Inertia::render('admin/posts/create', [
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostRequest $request): RedirectResponse
    {
        $this->authorize('create', Post::class);

        $data = $request->validated();
        $data['user_id'] = Auth::id();

        // Extract SEO data
        $seoData = [
            'title' => $data['seo_title'] ?? null,
            'keywords' => $data['seo_keywords'] ?? null,
            'description' => $data['seo_description'] ?? null,
        ];

        // Remove SEO fields from post data
        unset($data['seo_title'], $data['seo_keywords'], $data['seo_description']);

        $post = Post::create($data);

        // Create SEO record
        if (!empty(array_filter($seoData))) {
            $post->seo()->create($seoData);
        }

        // Attach tags if provided
        if (isset($data['tags']) && is_array($data['tags'])) {
            $post->tags()->attach($data['tags']);
        }

        return redirect()->route('admin.posts.index')
            ->with('success', 'Post created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post): Response
    {
        $this->authorize('view', $post);

        return Inertia::render('admin/posts/show', [
            'post' => $post->load(['user', 'category', 'tags', 'seo']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post): Response
    {
        $this->authorize('update', $post);

        $categories = Category::orderBy('name')->get();
        $tags = Tag::orderBy('name')->get();

        return Inertia::render('admin/posts/edit', [
            'post' => $post->load(['tags', 'seo']),
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        $this->authorize('update', $post);

        $data = $request->validated();

        // Extract SEO data
        $seoData = [
            'title' => $data['seo_title'] ?? null,
            'keywords' => $data['seo_keywords'] ?? null,
            'description' => $data['seo_description'] ?? null,
        ];

        // Remove SEO fields from post data
        unset($data['seo_title'], $data['seo_keywords'], $data['seo_description']);

        $post->update($data);

        // Update or create SEO record
        if (!empty(array_filter($seoData))) {
            $post->seo()->updateOrCreate([], $seoData);
        }

        // Sync tags if provided
        if (isset($data['tags'])) {
            $post->tags()->sync($data['tags']);
        }

        return redirect()->route('admin.posts.index')
            ->with('success', 'Post updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post): RedirectResponse
    {
        $this->authorize('delete', $post);

        // Delete the post (tags will be detached automatically via the pivot table cascade)
        $post->delete();

        return redirect()->route('admin.posts.index')
            ->with('success', 'Post deleted successfully.');
    }

    /**
     * Remove multiple resources from storage.
     */
    public function bulkDestroy(Request $request): RedirectResponse
    {
        $this->authorize('viewAny', Post::class);

        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:posts,id',
        ]);

        $ids = $validated['ids'];
        $postsToDelete = Post::whereIn('id', $ids)->get();

        // Check authorization for each post
        foreach ($postsToDelete as $post) {
            $this->authorize('delete', $post);
        }

        // Log the bulk delete operation
        Log::info('Bulk deleting posts: ' . count($postsToDelete) . ' posts', ['ids' => $ids]);

        // Delete the posts
        Post::whereIn('id', $ids)->delete();

        return redirect()->route('admin.posts.index')
            ->with('success', count($ids) . ' posts deleted successfully.');
    }

    /**
     * Update the status of a post.
     */
    public function updateStatus(Request $request, Post $post)
    {
        $this->authorize('update', $post);

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:draft,published,archived'],
        ]);

        // Update the post status
        $post->update([
            'status' => $validated['status'],
            // Set published_at if status is published and it's not already set
            'published_at' => $validated['status'] === 'published' && !$post->published_at ? now() : $post->published_at,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Post status updated successfully.',
            'post' => $post->fresh(),
        ]);
    }
}
