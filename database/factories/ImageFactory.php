<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Image>
 */
class ImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $filename = Str::random(20) . '.jpg';
        $collections = ['posts', 'pages', 'gallery', 'avatars'];

        return [
            'user_id' => User::factory(),
            'filename' => $filename,
            'original_filename' => fake()->words(3, true) . '.jpg',
            'mime_type' => 'image/jpeg',
            'path' => 'images/' . $filename,
            'disk' => 'public',
            'collection' => fake()->randomElement($collections),
            'size' => fake()->numberBetween(50000, 5000000),
            'alt_text' => fake()->optional(0.7)->sentence(),
            'title' => fake()->optional(0.7)->words(3, true),
            'description' => fake()->optional(0.5)->paragraph(),
        ];
    }
}
