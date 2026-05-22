<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class InputMultipleController extends Controller
{
    public function index()
    {
        $data = [
            'title' => 'Input Multiple Data'
        ];
        return view('admin.input-multiple.index', $data);
    }

    public function store(Request $request)
    {
        // Validasi file yang diupload (harus excel)
        $request->validate([
            'file' => 'required|mimes:xlsx,xls'
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            
            // Simpan file sementara di storage/app/public atau baca langsung
            // Misalnya mengambil path real file sementara
            $filePath = $file->getRealPath();

            // ====================================================================
            // TODO: TULIS KODE UNTUK MEMBACA DAN MENGOLAH FILE EXCEL DI SINI
            // ====================================================================
            // Anda bisa menggunakan library seperti Maatwebsite/Laravel-Excel atau 
            // PhpOffice/PhpSpreadsheet.
            // 
            // Contoh alur jika menggunakan Maatwebsite/Laravel-Excel:
            // 1. Install package: composer require maatwebsite/excel
            // 2. Buat import class: php artisan make:import MultipleDataImport
            // 3. Panggil import class di sini:
            //    Excel::import(new MultipleDataImport, $file);
            // 
            // Anda perlu meloop setiap sheet yang ada (Angkatan, Alat, Ruang, dll)
            // dan melakukan insert ke database masing-masing sesuai model.
            // ====================================================================

            return redirect()->back()->with('success', 'File berhasil diupload dan diproses! (Fungsi proses belum diimplementasikan)');
        }

        return redirect()->back()->with('error', 'Gagal mengupload file.');
    }
}
