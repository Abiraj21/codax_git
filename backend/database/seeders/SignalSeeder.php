<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Signal;
use App\Models\Account;

class SignalSeeder extends Seeder
{

    public function run()
    {
        $accounts = Account::all();
        foreach ($accounts as $account) {
            Signal::firstOrCreate([
                'account_id' => $account->id,
                'type' => 'intent',
            ], [
                'status' => 'active',
                'payload' => ['page' => 'home', 'clicked' => true]
            ]);

            Signal::firstOrCreate([
                'account_id' => $account->id,
                'type' => 'web_visit',
            ], [
                'status' => 'active',
                'payload' => ['page' => 'pricing', 'clicked' => false]
            ]);

            Signal::firstOrCreate([
                'account_id' => $account->id,
                'type' => 'purchase',
            ], [
                'status' => 'archived',
                'payload' => ['amount' => 199, 'currency' => 'USD']
            ]);
        }
    }
}
