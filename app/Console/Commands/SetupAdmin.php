<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class SetupAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'setup:admin {--email=admin@example.com : The email for the admin user} 
                                       {--password=password : The password for the admin user}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create roles, permissions, and a super admin user in one command';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Setting up roles, permissions, and admin user...');

        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Step 1: Create roles and permissions
        $this->createRolesAndPermissions();

        // Step 2: Create or update admin user
        $this->createAdminUser();

        $this->info('Setup completed successfully!');
        $this->info('Admin credentials:');
        $this->info('Email: ' . $this->option('email'));
        $this->info('Password: ' . $this->option('password'));

        return Command::SUCCESS;
    }

    /**
     * Create roles and permissions
     */
    private function createRolesAndPermissions()
    {
        $this->info('Creating roles and permissions...');

        // Check if permissions already exist
        if (Permission::count() > 0) {
            $this->info('Permissions already exist. Skipping permission creation.');
        } else {
            // Create permissions
            // Category permissions
            Permission::create(['name' => 'view categories']);
            Permission::create(['name' => 'create categories']);
            Permission::create(['name' => 'edit categories']);
            Permission::create(['name' => 'delete categories']);

            // Tag permissions
            Permission::create(['name' => 'view tags']);
            Permission::create(['name' => 'create tags']);
            Permission::create(['name' => 'edit tags']);
            Permission::create(['name' => 'delete tags']);

            // Post permissions
            Permission::create(['name' => 'view posts']);
            Permission::create(['name' => 'create posts']);
            Permission::create(['name' => 'edit posts']);
            Permission::create(['name' => 'delete posts']);
            Permission::create(['name' => 'publish posts']);
            Permission::create(['name' => 'edit all posts']);
            Permission::create(['name' => 'delete all posts']);

            // Page permissions
            Permission::create(['name' => 'view pages']);
            Permission::create(['name' => 'create pages']);
            Permission::create(['name' => 'edit pages']);
            Permission::create(['name' => 'delete pages']);
            Permission::create(['name' => 'publish pages']);
            Permission::create(['name' => 'edit all pages']);
            Permission::create(['name' => 'delete all pages']);

            // User permissions
            Permission::create(['name' => 'view users']);
            Permission::create(['name' => 'create users']);
            Permission::create(['name' => 'edit users']);
            Permission::create(['name' => 'delete users']);

            // Role permissions
            Permission::create(['name' => 'view roles']);
            Permission::create(['name' => 'create roles']);
            Permission::create(['name' => 'edit roles']);
            Permission::create(['name' => 'delete roles']);

            // Image permissions
            Permission::create(['name' => 'view images']);
            Permission::create(['name' => 'create images']);
            Permission::create(['name' => 'edit images']);
            Permission::create(['name' => 'delete images']);
            Permission::create(['name' => 'edit all images']);
            Permission::create(['name' => 'delete all images']);

            // Setting permissions
            Permission::create(['name' => 'view settings']);
            Permission::create(['name' => 'create settings']);
            Permission::create(['name' => 'edit settings']);
            Permission::create(['name' => 'delete settings']);

            $this->info('All permissions created successfully.');
        }

        // Check if roles already exist
        if (Role::count() > 0) {
            $this->info('Roles already exist. Skipping role creation.');
        } else {
            // Create roles and assign permissions
            // Admin role
            $adminRole = Role::create(['name' => 'admin']);
            $adminRole->givePermissionTo(Permission::all());

            // Editor role
            $editorRole = Role::create(['name' => 'editor']);
            $editorRole->givePermissionTo([
                'view categories', 'view tags',
                'view posts', 'create posts', 'edit posts', 'delete posts', 'publish posts', 'edit all posts', 'delete all posts',
                'view pages', 'create pages', 'edit pages', 'delete pages', 'publish pages', 'edit all pages', 'delete all pages',
                'view images', 'create images', 'edit images', 'delete images', 'edit all images', 'delete all images',
                'view settings',
            ]);

            // Author role
            $authorRole = Role::create(['name' => 'author']);
            $authorRole->givePermissionTo([
                'view categories', 'view tags',
                'view posts', 'create posts', 'edit posts', 'delete posts', 'publish posts',
                'view pages',
                'view images', 'create images', 'edit images', 'delete images',
            ]);

            $this->info('All roles created successfully.');
        }

        // Make sure admin role has all permissions
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            $adminRole->syncPermissions(Permission::all());
            $this->info('Admin role has been given all permissions.');
        }
    }

    /**
     * Create or update admin user
     */
    private function createAdminUser()
    {
        $email = $this->option('email');
        $password = $this->option('password');

        // Check if user already exists
        $user = User::where('email', $email)->first();

        if ($user) {
            $this->info("User with email {$email} already exists.");
            $this->info("Updating user to have admin role...");
        } else {
            // Create the user
            $user = new User();
            $user->name = 'Admin User';
            $user->email = $email;
            $user->password = Hash::make($password);
            $user->email_verified_at = now();
            $user->save();
            
            $this->info("Admin user created: {$user->name} <{$user->email}>");
        }

        // Get the admin role
        $adminRole = Role::where('name', 'admin')->first();
        
        if (!$adminRole) {
            $this->error('Admin role not found! This should not happen as we just created it.');
            return;
        }

        // Assign admin role to the user
        $user->syncRoles([$adminRole->name]);
        
        $this->info("Admin role assigned to {$user->name}");
        $this->info("This user now has all permissions granted to the admin role");
    }
}
