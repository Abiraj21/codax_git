<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\SignalController;

Route::get('/accounts', [AccountController::class, 'index']);
Route::get('/accounts/{id}/signals', [SignalController::class, 'byAccount']);
Route::post('/signals', [SignalController::class, 'store']);
Route::patch('/signals/{id}/archive', [SignalController::class, 'archive']);
Route::get('/signals', [SignalController::class, 'filter']);
