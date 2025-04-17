<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $admin = User::where('is_admin', true)->first();

        // Create regular pages
        Page::factory(15)
            ->recycle($users)
            ->create();

        // Create published pages
        Page::factory(5)
            ->published()
            ->recycle([$admin])
            ->create();

        // Create draft pages
        Page::factory(3)
            ->draft()
            ->recycle($users)
            ->create();
    }
}
