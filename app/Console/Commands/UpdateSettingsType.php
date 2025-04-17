<?php

namespace App\Console\Commands;

use Database\Seeders\UpdateSettingsTypeSeeder;
use Illuminate\Console\Command;

class UpdateSettingsType extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-settings-type';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update settings to use richtext type for site description and add author bio';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Updating settings types...');
        
        $seeder = new UpdateSettingsTypeSeeder();
        $seeder->run();
        
        // Clear the settings cache
        app('settings')->clearCache();
        
        $this->info('Settings types updated successfully!');
        
        return Command::SUCCESS;
    }
}
