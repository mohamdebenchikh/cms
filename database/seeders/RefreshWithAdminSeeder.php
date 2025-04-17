<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class RefreshWithAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles and permissions
        $this->call(RolesAndPermissionsSeeder::class);

        // Create admin user and assign role
        $this->call(AdminSeeder::class);
    }
}
