const XLSX = require('xlsx');

// Create a new workbook
const wb = XLSX.utils.book_new();

// Define data for each sheet (headers only)
const sheets = {
    'Angkatan': [['Tahun Angkatan']],
    'Alat': [['Kode Alat', 'Nama Alat', 'Kondisi']],
    'Ruang': [['Kode Ruang', 'Nama Ruang', 'Kapasitas']],
    'Dosen': [['NIP', 'Nama Dosen', 'Status']],
    'Jam': [['Jam Mulai', 'Jam Selesai']],
    'Prodi': [['Kode Prodi', 'Nama Prodi']],
    'Mahasiswa': [['NIM', 'Nama Mahasiswa', 'Prodi', 'Angkatan']]
};

// Add each sheet to the workbook
for (const [sheetName, data] of Object.entries(sheets)) {
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Set column widths
    const wscols = data[0].map(() => ({wch: 20}));
    ws['!cols'] = wscols;
    
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
}

// Write the file
XLSX.writeFile(wb, 'public/template_input_multiple.xlsx');
console.log('Template created successfully at public/template_input_multiple.xlsx');
