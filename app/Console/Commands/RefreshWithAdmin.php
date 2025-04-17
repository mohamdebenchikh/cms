<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class RefreshWithAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:refresh-admin {--force : Force the operation to run without confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Refresh the database and seed only the admin user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (!$this->option('force') && !$this->confirm('This will delete all data in your database. Are you sure you want to continue?')) {
            $this->info('Operation cancelled.');
            return;
        }

        $this->info('Refreshing database...');
        $this->call('migrate:fresh');

        $this->info('Seeding admin user and roles...');
        $this->call('db:seed', [
            '--class' => 'Database\\Seeders\\RefreshWithAdminSeeder',
        ]);

        $this->info('Database has been refreshed with admin user.');
        $this->info('Admin credentials:');
        $this->info('Email: admin@example.com');
        $this->info('Password: password');
    }
}
