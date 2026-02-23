<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CsvImportController;
use App\Http\Controllers\ContactsController;
use App\Http\Controllers\CompaniesController;

Route::post('/csv-import', [CsvImportController::class, 'store']);

Route::get('/contacts', [ContactsController::class, 'index']);
Route::get('/contacts/{id}', [ContactsController::class, 'show']);
Route::post('/contacts/{id}/action', [ContactsController::class, 'applyAction']);
Route::patch('/contacts/{id}', [ContactsController::class, 'updateContact']);

Route::get('/companies', [CompaniesController::class, 'index']);
Route::get('/companies/{id}', [CompaniesController::class, 'show']);
Route::patch('/companies/{id}', [CompaniesController::class, 'updateCompany']);
Route::post('/companies/{id}/action', [CompaniesController::class, 'applyAction']);
Route::get('/companies/{id}/related-contacts', [CompaniesController::class, 'relatedContacts']);
Route::get('/companies/{id}/related-deals', [CompaniesController::class, 'relatedDeals']);