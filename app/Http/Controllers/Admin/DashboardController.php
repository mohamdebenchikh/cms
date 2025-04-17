<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Image;
use App\Models\Page;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(Request $request): Response
    {
        // Get counts
        $totalPosts = Post::count();
        $totalPages = Page::count();
        $totalUsers = User::count();
        $totalImages = Image::count();
        $totalCategories = Category::count();
        $totalTags = Tag::count();
        
        // Get recent posts
        $recentPosts = Post::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'status' => $post->status,
                    'created_at' => $post->created_at,
                    'user' => [
                        'name' => $post->user->name,
                    ],
                ];
            });
        
        // Get posts by status
        $postsByStatus = Post::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'status' => $item->status,
                    'count' => $item->count,
                ];
            });
        
        // Get posts by month (last 6 months)
        $postsByMonth = collect();
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $month = $date->format('M Y');
            
            $count = Post::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();
            
            $postsByMonth->push([
                'month' => $month,
                'count' => $count,
            ]);
        }
        
        // Get popular categories
        $popularCategories = Category::withCount('posts')
            ->orderBy('posts_count', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($category) {
                return [
                    'name' => $category->name,
                    'count' => $category->posts_count,
                ];
            });
        
        return Inertia::render('admin/dashboard/index', [
            'stats' => [
                'totalPosts' => $totalPosts,
                'totalPages' => $totalPages,
                'totalUsers' => $totalUsers,
                'totalImages' => $totalImages,
                'totalCategories' => $totalCategories,
                'totalTags' => $totalTags,
                'recentPosts' => $recentPosts,
                'postsByStatus' => $postsByStatus,
                'postsByMonth' => $postsByMonth,
                'popularCategories' => $popularCategories,
            ],
        ]);
    }
}
