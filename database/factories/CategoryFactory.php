<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(rand(1, 2), true);
        $name = ucwords($name);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->optional(0.7)->paragraph(),
            'image_cover' => fake()->optional(0.5)->imageUrl(1200, 800),
            'is_main' => false,
        ];
    }

    /**
     * Indicate that the category is a main category.
     */
    public function main(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'is_main' => true,
            ];
        });
    }
}
