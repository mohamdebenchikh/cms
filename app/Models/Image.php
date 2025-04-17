<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Image extends Model
{
    /** @use HasFactory<\Database\Factories\ImageFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'filename',
        'original_filename',
        'mime_type',
        'path',
        'disk',
        'collection',
        'size',
        'alt_text',
        'title',
        'description',
    ];

    /**
     * Get the user that owns the image.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the full URL to the image.
     */
    public function getUrlAttribute(): string
    {
        try {
            $url = Storage::disk($this->disk)->url($this->path);

            // Check if the URL is valid
            if (empty($url) || $url === '/') {
                // Log the issue
                \Illuminate\Support\Facades\Log::warning('Invalid image URL generated', [
                    'image_id' => $this->id,
                    'path' => $this->path,
                    'disk' => $this->disk,
                    'url' => $url
                ]);

                // Return a fallback URL
                return asset('placeholder-image.svg');
            }

            return $url;
        } catch (\Exception $e) {
            // Log the exception
            \Illuminate\Support\Facades\Log::error('Error generating image URL', [
                'image_id' => $this->id,
                'path' => $this->path,
                'disk' => $this->disk,
                'error' => $e->getMessage()
            ]);

            // Return a fallback URL
            return asset('placeholder-image.svg');
        }
    }

    /**
     * Get the file name for frontend display.
     */
    public function getFileNameAttribute(): string
    {
        return $this->original_filename ?? $this->filename ?? 'Unknown';
    }

    /**
     * Get the file path for frontend display.
     */
    public function getFilePathAttribute(): string
    {
        return $this->path;
    }

    /**
     * Get the file size for frontend display.
     */
    public function getFileSizeAttribute(): int
    {
        return $this->size;
    }

    /**
     * Get the file type for frontend display.
     */
    public function getFileTypeAttribute(): string
    {
        return $this->mime_type;
    }

    /**
     * Delete the image file from storage when the model is deleted.
     */
    protected static function booted(): void
    {
        static::deleting(function (Image $image) {
            if (Storage::disk($image->disk)->exists($image->path)) {
                Storage::disk($image->disk)->delete($image->path);
            }
        });
    }
}
