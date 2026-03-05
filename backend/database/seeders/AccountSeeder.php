<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Account;

class AccountSeeder extends Seeder
{

    public function run()
    {
        Account::create(['name' => 'Tesla']);
        Account::create(['name' => 'Amazon']);
        Account::create(['name' => 'Spotify']);
        Account::create(['name' => 'Stripe']);
        Account::create(['name' => 'Airbnb']);
    }
}
