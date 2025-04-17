<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AddRolePermissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'roles:add-permissions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add role permissions if they are missing';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Adding role permissions...');

        // Check if role permissions exist
        $rolePermissions = [
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',
        ];

        $permissionsAdded = 0;

        foreach ($rolePermissions as $permissionName) {
            $permission = Permission::where('name', $permissionName)->first();
            
            if (!$permission) {
                Permission::create(['name' => $permissionName]);
                $this->info("Created permission: {$permissionName}");
                $permissionsAdded++;
            } else {
                $this->info("Permission already exists: {$permissionName}");
            }
        }

        // Make sure admin role has all permissions
        $adminRole = Role::where('name', 'admin')->first();
        
        if ($adminRole) {
            $adminRole->syncPermissions(Permission::all());
            $this->info('Admin role has been given all permissions');
        } else {
            $this->error('Admin role not found');
        }

        $this->info("Added {$permissionsAdded} new permissions");
        $this->info('Done!');

        return Command::SUCCESS;
    }
}
