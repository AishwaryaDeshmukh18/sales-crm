<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/search', function () {
    return Inertia::render('GlobalSearch');
});

Route::get('/{any?}', function () {
    return view('welcome');
})->where('any', '.*');
