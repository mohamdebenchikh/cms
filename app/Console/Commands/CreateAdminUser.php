<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class CreateAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:create {--name= : The name of the admin user} 
                                        {--email= : The email of the admin user} 
                                        {--password= : The password for the admin user}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new admin user with all permissions';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Get or prompt for name
        $name = $this->option('name');
        if (!$name) {
            $name = $this->ask('Enter admin name');
        }

        // Get or prompt for email
        $email = $this->option('email');
        if (!$email) {
            $email = $this->ask('Enter admin email');
        }

        // Check if email already exists
        if (User::where('email', $email)->exists()) {
            $this->error("A user with email {$email} already exists!");
            
            if (!$this->confirm('Do you want to update this user to have admin role?', true)) {
                return 1;
            }
            
            $user = User::where('email', $email)->first();
            $this->info("Using existing user: {$user->name}");
        } else {
            // Get or prompt for password
            $password = $this->option('password');
            if (!$password) {
                $password = $this->secret('Enter admin password (min 8 characters)');
                
                // Validate password
                if (strlen($password) < 8) {
                    $this->error('Password must be at least 8 characters long!');
                    return 1;
                }
                
                // Confirm password
                $confirmPassword = $this->secret('Confirm admin password');
                if ($password !== $confirmPassword) {
                    $this->error('Passwords do not match!');
                    return 1;
                }
            }

            // Create the user
            $user = new User();
            $user->name = $name;
            $user->email = $email;
            $user->password = Hash::make($password);
            $user->email_verified_at = now();
            $user->save();
            
            $this->info("Admin user created: {$user->name} <{$user->email}>");
        }

        // Get the admin role
        $adminRole = Role::where('name', 'admin')->first();
        
        if (!$adminRole) {
            $this->error('Admin role not found! Please run the RolesAndPermissionsSeeder first.');
            return 1;
        }

        // Assign admin role to the user
        $user->syncRoles([$adminRole->name]);
        
        $this->info("Admin role assigned to {$user->name}");
        $this->info("This user now has all permissions granted to the admin role");
        
        return 0;
    }
}
