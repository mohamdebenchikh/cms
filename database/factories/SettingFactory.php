<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Setting>
 */
class SettingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['text', 'textarea', 'boolean', 'select', 'number', 'file'];
        $groups = ['general', 'appearance', 'seo', 'social', 'email', 'advanced'];
        $type = fake()->randomElement($types);
        
        return [
            'key' => fake()->unique()->word(),
            'value' => $this->getValueForType($type),
            'display_name' => fake()->words(2, true),
            'type' => $type,
            'options' => $type === 'select' ? json_encode(['option1', 'option2', 'option3']) : null,
            'group' => fake()->randomElement($groups),
            'description' => fake()->optional(0.7)->sentence(),
            'is_public' => fake()->boolean(30),
            'order' => fake()->numberBetween(0, 100),
        ];
    }
    
    /**
     * Get a random value based on the setting type.
     *
     * @param string $type
     * @return mixed
     */
    protected function getValueForType(string $type)
    {
        switch ($type) {
            case 'boolean':
                return fake()->boolean() ? '1' : '0';
            case 'number':
                return (string) fake()->numberBetween(1, 100);
            case 'select':
                return fake()->randomElement(['option1', 'option2', 'option3']);
            case 'textarea':
                return fake()->paragraph();
            case 'file':
                return 'images/' . fake()->word() . '.jpg';
            default:
                return fake()->sentence();
        }
    }
}
