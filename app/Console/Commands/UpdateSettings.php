<?php

namespace App\Console\Commands;

use Database\Seeders\SettingSeeder;
use Illuminate\Console\Command;

class UpdateSettings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-settings';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update settings with the latest values from the seeder';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Updating settings...');
        
        $seeder = new SettingSeeder();
        $seeder->run();
        
        // Clear the settings cache
        app('settings')->clearCache();
        
        $this->info('Settings updated successfully!');
        
        return Command::SUCCESS;
    }
}
