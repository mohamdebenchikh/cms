<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class AddBasicPagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Only run the BasicPagesSeeder
        $this->call(BasicPagesSeeder::class);
    }
}
