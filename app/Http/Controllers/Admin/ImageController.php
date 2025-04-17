<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Image;
use App\Http\Requests\StoreImageRequest;
use App\Http\Requests\UpdateImageRequest;
use App\Services\DataTableService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Image::class);

        // Create a query with eager loading
        $query = Image::with('user');

        // Create a new DataTableService instance directly
        $dataTable = new DataTableService($query, $request);

        // Configure the DataTable service
        $dataTable->setDefaultSortField('created_at')
            ->setDefaultSortDirection('desc')
            ->setDefaultPerPage(20)
            ->setSearchableFields(['title', 'alt_text', 'description', 'original_filename']);

        // Process the query and get results
        $result = $dataTable->process();

        return Inertia::render('admin/images/index', [
            'images' => $result['data'],
            'filters' => $result['filters']
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $this->authorize('create', Image::class);

        return Inertia::render('admin/images/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreImageRequest $request)
    {
        $this->authorize('create', Image::class);

        $file = $request->file('file');
        $originalFilename = $file->getClientOriginalName();
        $filename = Str::random(20) . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('images', $filename, 'public');

        // Create the image record with all fields from the migration
        $image = Image::create([
            'user_id' => Auth::id(),
            'filename' => $filename,
            'original_filename' => $originalFilename,
            'mime_type' => $file->getMimeType(),
            'path' => $path,
            'disk' => $request->disk ?? 'public',
            'collection' => $request->collection ?? 'general',
            'size' => $file->getSize(),
            'alt_text' => $request->alt_text,
            'title' => $request->title ?? $originalFilename,
            'description' => $request->description,
        ]);

        // Check if the request wants JSON response (for AJAX uploads)
        if ($request->expectsJson() || $request->ajax()) {
            $url = Storage::disk($image->disk)->url($image->path);
            return response()->json([
                'success' => true,
                'url' => $url,
                'id' => $image->id,
                'filename' => $image->filename,
                'path' => $image->path
            ]);
        }

        return redirect()->route('admin.images.index')
            ->with('success', 'Image uploaded successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Image $image): Response
    {
        $this->authorize('view', $image);

        return Inertia::render('admin/images/show', [
            'image' => $image->load('user'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Image $image): Response
    {
        $this->authorize('update', $image);

        return Inertia::render('admin/images/edit', [
            'image' => $image,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateImageRequest $request, Image $image): RedirectResponse
    {
        $this->authorize('update', $image);

        $image->update($request->validated());

        return redirect()->route('admin.images.index')
            ->with('success', 'Image updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Image $image): RedirectResponse
    {
        $this->authorize('delete', $image);

        // The image file will be deleted automatically via the model's boot method
        $image->delete();

        return redirect()->route('admin.images.index')
            ->with('success', 'Image deleted successfully.');
    }

    /**
     * Show the upload page.
     */
    public function uploadPage()
    {
        $this->authorize('create', Image::class);

        return inertia('Admin/Images/Upload');
    }

    /**
     * Remove multiple resources from storage.
     */
    public function bulkDestroy(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:images,id',
        ]);

        $ids = $request->input('ids');
        $deletedCount = 0;

        // Get all images to check permissions individually
        $images = Image::whereIn('id', $ids)->get();

        foreach ($images as $image) {
            // Check if user can delete this image
            if (Auth::user()->can('delete', $image)) {
                // The image file will be deleted automatically via the model's boot method
                $image->delete();
                $deletedCount++;
            }
        }

        return redirect()->route('admin.images.index')
            ->with('success', $deletedCount . ' ' . Str::plural('image', $deletedCount) . ' deleted successfully.');
    }

    /**
     * Upload an image and return the URL.
     */
    public function upload(Request $request): JsonResponse
    {
        $this->authorize('create', Image::class);

        try {
            // Log the incoming request for debugging
            Log::info('Image upload request received', [
                'has_file' => $request->hasFile('image'),
                'content_type' => $request->header('Content-Type'),
                'method' => $request->method(),
                'all_files' => $request->allFiles(),
                'all_headers' => $request->headers->all(),
            ]);

            $request->validate([
                'image' => 'required|image|max:10240', // 10MB max
                'alt_text' => 'nullable|string|max:255',
                'title' => 'nullable|string|max:255',
                'collection' => 'nullable|string|max:255',
            ]);

            $file = $request->file('image');

            if (!$file) {
                Log::error('No image file provided', [
                    'request' => $request->all(),
                    'files' => $request->allFiles(),
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'No image file provided'
                ], 422);
            }

            $originalFilename = $file->getClientOriginalName();
            $filename = Str::random(20) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('images', $filename, 'public');

            $image = Image::create([
                'user_id' => Auth::id(),
                'filename' => $filename,
                'original_filename' => $originalFilename,
                'mime_type' => $file->getMimeType(),
                'path' => $path,
                'disk' => 'public',
                'collection' => $request->collection ?? 'post-featured-images',
                'size' => $file->getSize(),
                'alt_text' => $request->alt_text,
                'title' => $request->title ?? $originalFilename,
                'description' => $request->description,
            ]);

            // Get the URL from the storage
            $url = Storage::disk($image->disk)->url($image->path);

            // Log the URL for debugging
            Log::info('Image uploaded successfully', [
                'image_id' => $image->id,
                'url' => $url,
                'path' => $image->path,
                'disk' => $image->disk
            ]);

            // Return a JSON response with the image URL
            return response()->json([
                'success' => true,
                'url' => $url,
                'id' => $image->id,
                'filename' => $image->filename
            ]);
        } catch (\Exception $e) {
            Log::error('Image upload error: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
                'request' => $request->all(),
                'files' => $request->allFiles(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error uploading image: ' . $e->getMessage()
            ], 500);
        }
    }
}
