<?php
namespace App\Http\Controllers;

class BaseController extends Controller
{
    protected string $backendUrl;

    public function __construct()
    {
        $this->backendUrl = config('services.backend.url');
    }
}