<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    protected $fillable = ['name'];

    public function signals()
    {
        return $this->hasMany(Signal::class);
    }
}
