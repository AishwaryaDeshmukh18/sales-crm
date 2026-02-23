<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CsvImportController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/csv-import', [CsvImportController::class, 'index']);
Route::post('/csv-import', [CsvImportController::class, 'store']);
