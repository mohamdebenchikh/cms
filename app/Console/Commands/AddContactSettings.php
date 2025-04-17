<?php

namespace App\Console\Commands;

use Database\Seeders\ContactSettingsSeeder;
use Illuminate\Console\Command;

class AddContactSettings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:add-contact-settings';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add contact information settings to the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Adding contact information settings...');
        
        $seeder = new ContactSettingsSeeder();
        $seeder->run();
        
        // Clear the settings cache
        app('settings')->clearCache();
        
        $this->info('Contact information settings added successfully!');
        
        return Command::SUCCESS;
    }
}
