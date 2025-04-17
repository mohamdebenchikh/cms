<?php

namespace App\Http\Controllers\Blog;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Page;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class BlogController extends Controller
{
    /**
     * Display the blog home page.
     */
    public function home()
    {
        // Get featured posts for the carousel
        $featuredPosts = Post::with(['category', 'user'])
            ->published()
            ->where('is_featured', true)
            ->latest('published_at')
            ->take(5)
            ->get();

        // If we don't have enough featured posts, get the latest posts to fill the carousel
        if ($featuredPosts->count() < 5) {
            $additionalPosts = Post::with(['category', 'user'])
                ->published()
                ->where('is_featured', false)
                ->whereNotIn('id', $featuredPosts->pluck('id'))
                ->latest('published_at')
                ->take(5 - $featuredPosts->count())
                ->get();

            $featuredPosts = $featuredPosts->concat($additionalPosts);
        }

        // Get a single featured post for backward compatibility
        $featuredPost = $featuredPosts->first();

        $latestPosts = Post::with(['category', 'user'])
            ->published()
            ->latest('published_at')
            ->take(6)
            ->get();

        // Check if views column exists
        $popularPosts = Post::with(['category', 'user'])
            ->published()
            ->when(Schema::hasColumn('posts', 'views'), function ($query) {
                return $query->orderBy('views', 'desc');
            }, function ($query) {
                return $query->latest('published_at');
            })
            ->take(5)
            ->get();

        $mainCategories = Category::withCount('posts')
            ->where('is_main', true)
            ->orderBy('name')
            ->take(10)
            ->get();

        // Get all categories for backward compatibility
        $categories = Category::withCount('posts')
            ->orderBy('posts_count', 'desc')
            ->take(20)
            ->get();

        $tags = Tag::withCount('posts')
            ->orderBy('posts_count', 'desc')
            ->take(20)
            ->get();

        // Get archive data (posts grouped by month and year)
        // Use SQLite-compatible date functions
        $archiveData = Post::published()
            ->selectRaw("strftime('%Y', published_at) as year, strftime('%m', published_at) as month, COUNT(*) as post_count")
            ->groupBy('year', 'month')
            ->orderByRaw('year DESC, month DESC')
            ->take(12) // Last 12 months
            ->get()
            ->map(function ($item) {
                // Convert string month to integer for Carbon
                $monthInt = (int)$item->month;
                $yearInt = (int)$item->year;
                $date = Carbon::createFromDate($yearInt, $monthInt, 1);
                return [
                    'year' => $yearInt,
                    'month' => $monthInt,
                    'month_name' => $date->format('F'),
                    'post_count' => $item->post_count,
                    'url' => route('blog.posts', ['year' => $yearInt, 'month' => $monthInt]),
                ];
            });

        return Inertia::render('blog/home', [
            'featuredPost' => $featuredPost,
            'featuredPosts' => $featuredPosts,
            'latestPosts' => $latestPosts,
            'popularPosts' => $popularPosts,
            'categories' => $categories,
            'mainCategories' => $mainCategories,
            'tags' => $tags,
            'archiveData' => $archiveData,
        ]);
    }

    /**
     * Display a single post.
     */
    public function post(string $slug)
    {
        $post = Post::with(['category', 'user', 'tags'])
            ->where('slug', $slug)
            ->published()
            ->firstOrFail();

        // Increment view count if the column exists
        if (Schema::hasColumn('posts', 'views')) {
            $post->increment('views');
        }

        // Get related posts
        $relatedPosts = Post::with(['category', 'user'])
            ->published()
            ->where('id', '!=', $post->id)
            ->where(function ($query) use ($post) {
                // Related by category
                if ($post->category_id) {
                    $query->where('category_id', $post->category_id);
                }

                // Related by tags
                if ($post->tags->count() > 0) {
                    $query->orWhereHas('tags', function ($q) use ($post) {
                        $q->whereIn('tags.id', $post->tags->pluck('id'));
                    });
                }
            })
            ->latest('published_at')
            ->take(2)
            ->get();

        $mainCategories = Category::withCount('posts')
            ->where('is_main', true)
            ->orderBy('name')
            ->take(10)
            ->get();

        // Get all categories for backward compatibility
        $categories = Category::withCount('posts')
            ->orderBy('posts_count', 'desc')
            ->take(20)
            ->get();

        $tags = Tag::withCount('posts')
            ->orderBy('posts_count', 'desc')
            ->take(20)
            ->get();

        return Inertia::render('blog/post', [
            'post' => $post,
            'relatedPosts' => $relatedPosts,
            'categories' => $categories,
            'mainCategories' => $mainCategories,
            'tags' => $tags,
        ]);
    }

    /**
     * Display posts by category.
     */
    public function category(string $slug)
    {
        $category = Category::where('slug', $slug)
            ->firstOrFail();

        // Get posts from this category
        $categoryIds = [$category->id];

        $posts = Post::with(['user', 'category'])
            ->published()
            ->whereIn('category_id', $categoryIds)
            ->latest('published_at')
            ->paginate(10)
            ->withQueryString();

        $mainCategories = Category::withCount('posts')
            ->where('is_main', true)
            ->orderBy('name')
            ->take(10)
            ->get();

        // Get all categories for backward compatibility
        $categories = Category::withCount('posts')
            ->orderBy('posts_count', 'desc')
            ->take(20)
            ->get();

        $tags = Tag::withCount('posts')
            ->orderBy('posts_count', 'desc')
            ->take(20)
            ->get();

        return Inertia::render('blog/category', [
            'category' => $category,
            'posts' => $posts,
            'categories' => $categories,
            'mainCategories' => $mainCategories,
            'tags' => $tags,
            'currentCategory' => $category,
        ]);
    }

    /**
     * Display posts by tag.
     */
    public function tag(string $slug)
    {
        $tag = Tag::where('slug', $slug)->firstOrFail();

        $posts = Post::with(['category', 'user'])
            ->published()
            ->whereHas('tags', function ($query) use ($tag) {
                $query->where('tags.id', $tag->id);
            })
            ->latest('published_at')
            ->paginate(10)
            ->withQueryString();

        $mainCategories = Category::withCount('posts')
            ->where('is_main', true)
            ->orderBy('name')
            ->take(10)
            ->get();

        // Get all categories for backward compatibility
        $categories = Category::withCount('posts')
            ->orderBy('posts_count', 'desc')
            ->take(20)
            ->get();

        $tags = Tag::withCount('posts')
            ->orderBy('posts_count', 'desc')
            ->take(20)
            ->get();

        return Inertia::render('blog/tag', [
            'tag' => $tag,
            'posts' => $posts,
            'categories' => $categories,
            'mainCategories' => $mainCategories,
            'tags' => $tags,
            'currentTag' => $tag,
        ]);
    }

    /**
     * Display all categories.
     */
    public function categories()
    {
        $categories = Category::withCount('posts')
            ->orderBy('name')
            ->get();

        return Inertia::render('blog/categories', [
            'categories' => $categories,
        ]);
    }

    /**
     * Display all posts (archive).
     */
    public function archive(Request $request)
    {
        // Get sort parameter from request
        $sort = $request->input('sort', 'newest');

        $query = Post::with(['category', 'user'])
            ->published();

        // Apply sorting
        if ($sort === 'oldest') {
            $query->oldest('published_at');
        } else {
            $query->latest('published_at');
        }

        $posts = $query->paginate(12)
            ->withQueryString();

        $mainCategories = Category::withCount('posts')
            ->where('is_main', true)
            ->orderBy('name')
            ->take(10)
            ->get();

        // Get all categories for backward compatibility
        $categories = Category::withCount('posts')
            ->orderBy('posts_count', 'desc')
            ->take(20)
            ->get();

        $tags = Tag::withCount('posts')
            ->orderBy('posts_count', 'desc')
            ->take(20)
            ->get();

        return Inertia::render('blog/archive', [
            'posts' => $posts,
            'categories' => $categories,
            'mainCategories' => $mainCategories,
            'tags' => $tags,
        ]);
    }

    /**
     * Search posts.
     */
    public function search(Request $request)
    {
        $query = $request->input('q');
        $sort = $request->input('sort', 'newest');

        $results = null;

        if ($query) {
            $searchQuery = Post::with(['category', 'user'])
                ->published()
                ->where(function ($q) use ($query) {
                    $q->where('title', 'like', "%{$query}%")
                      ->orWhere('content', 'like', "%{$query}%")
                      ->orWhere('excerpt', 'like', "%{$query}%");
                });

            // Apply sorting
            if ($sort === 'oldest') {
                $searchQuery->oldest('published_at');
            } else {
                $searchQuery->latest('published_at');
            }

            $results = $searchQuery->paginate(10)
                ->withQueryString();
        }

        $mainCategories = Category::withCount('posts')
            ->where('is_main', true)
            ->orderBy('name')
            ->take(10)
            ->get();

        // Get all categories for backward compatibility
        $categories = Category::withCount('posts')
            ->orderBy('posts_count', 'desc')
            ->take(20)
            ->get();

        $tags = Tag::withCount('posts')
            ->orderBy('posts_count', 'desc')
            ->take(20)
            ->get();

        return Inertia::render('blog/search', [
            'query' => $query,
            'results' => $results,
            'categories' => $categories,
            'mainCategories' => $mainCategories,
            'tags' => $tags,
        ]);
    }

    /**
     * Display the about page.
     */
    public function about()
    {
        $page = Page::where('slug', 'about')
            ->where('status', 'published')
            ->firstOrFail();

        $team = User::whereHas('roles', function ($query) {
                $query->where('name', 'admin')
                      ->orWhere('name', 'editor');
            })
            ->get();

        $mainCategories = Category::withCount('posts')
            ->where('is_main', true)
            ->orderBy('name')
            ->take(10)
            ->get();

        $categories = Category::withCount('posts')
            ->orderBy('posts_count', 'desc')
            ->take(20)
            ->get();

        return Inertia::render('blog/about', [
            'page' => $page,
            'team' => $team,
            'categories' => $categories,
            'mainCategories' => $mainCategories,
        ]);
    }

    /**
     * Display the privacy policy.
     */
    public function privacy()
    {
        $page = Page::where('slug', 'privacy-policy')
            ->where('status', 'published')
            ->firstOrFail();

        $mainCategories = Category::withCount('posts')
            ->where('is_main', true)
            ->orderBy('name')
            ->take(10)
            ->get();

        $categories = Category::withCount('posts')
            ->orderBy('posts_count', 'desc')
            ->take(20)
            ->get();

        return Inertia::render('blog/page', [
            'page' => $page,
            'categories' => $categories,
            'mainCategories' => $mainCategories,
        ]);
    }

    /**
     * Display the terms of service.
     */
    public function terms()
    {
        $page = Page::where('slug', 'terms-of-service')
            ->where('status', 'published')
            ->firstOrFail();

        $mainCategories = Category::withCount('posts')
            ->where('is_main', true)
            ->orderBy('name')
            ->take(10)
            ->get();

        $categories = Category::withCount('posts')
            ->orderBy('posts_count', 'desc')
            ->take(20)
            ->get();

        return Inertia::render('blog/page', [
            'page' => $page,
            'categories' => $categories,
            'mainCategories' => $mainCategories,
        ]);
    }

    /**
     * Display the categories test page.
     */
    public function categoriesTest()
    {
        $categories = Category::withCount('posts')
            ->orderBy('name')
            ->get();

        $mainCategories = Category::withCount('posts')
            ->where('is_main', true)
            ->orderBy('name')
            ->take(10)
            ->get();

        return Inertia::render('blog/categories-test', [
            'categories' => $categories,
            'mainCategories' => $mainCategories,
        ]);
    }

    /**
     * Display all blog posts with pagination and sorting.
     */
    public function posts(Request $request)
    {
        // Get sort parameter from request
        $sort = $request->input('sort', 'newest');

        // Get filter parameters
        $categoryId = $request->input('category');
        $tagId = $request->input('tag');
        $year = $request->input('year');
        $month = $request->input('month');

        $query = Post::with(['category', 'user', 'tags'])
            ->published();

        // Apply category filter if provided
        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        // Apply tag filter if provided
        if ($tagId) {
            $query->whereHas('tags', function($q) use ($tagId) {
                $q->where('tags.id', $tagId);
            });
        }

        // Apply date filters if provided - using SQLite compatible functions
        if ($year && $month) {
            // Format month with leading zero if needed
            $formattedMonth = str_pad($month, 2, '0', STR_PAD_LEFT);
            $query->whereRaw("strftime('%Y', published_at) = ?" , [$year])
                  ->whereRaw("strftime('%m', published_at) = ?", [$formattedMonth]);
        } elseif ($year) {
            $query->whereRaw("strftime('%Y', published_at) = ?", [$year]);
        }

        // Apply sorting
        if ($sort === 'oldest') {
            $query->oldest('published_at');
        } else {
            $query->latest('published_at');
        }

        $posts = $query->paginate(9)
            ->withQueryString();

        $mainCategories = Category::withCount('posts')
            ->where('is_main', true)
            ->orderBy('name')
            ->take(10)
            ->get();

        // Get all categories for filtering
        $categories = Category::withCount('posts')
            ->orderBy('posts_count', 'desc')
            ->take(20)
            ->get();

        $tags = Tag::withCount('posts')
            ->orderBy('posts_count', 'desc')
            ->take(20)
            ->get();

        return Inertia::render('blog/posts', [
            'posts' => $posts,
            'categories' => $categories,
            'mainCategories' => $mainCategories,
            'tags' => $tags,
            'filters' => [
                'sort' => $sort,
                'category' => $categoryId,
                'tag' => $tagId,
                'year' => $year,
                'month' => $month
            ]
        ]);
    }
}
