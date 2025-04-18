<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Console\Commands\CreateAdminUser;
use App\Console\Commands\SetupAdmin;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Register the CreateAdminUser command
Artisan::registerCommand(new CreateAdminUser());

// Register the SetupAdmin command
Artisan::registerCommand(new SetupAdmin());
