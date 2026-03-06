<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Signal extends Model
{
    protected $fillable = ['account_id', 'type', 'status', 'payload'];

    protected $casts = ['payload' => 'array'];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }
}
