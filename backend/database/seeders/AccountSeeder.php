<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Account;

class AccountSeeder extends Seeder
{

    public function run()
    {
        Account::firstOrCreate(['name' => 'Tesla']);
        Account::firstOrCreate(['name' => 'Amazon']);
        Account::firstOrCreate(['name' => 'Spotify']);
        Account::firstOrCreate(['name' => 'Stripe']);
        Account::firstOrCreate(['name' => 'Airbnb']);
    }
}
