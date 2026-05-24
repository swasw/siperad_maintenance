window.addEventListener('DOMContentLoaded', event => {
    // Simple-DataTables
    // https://github.com/fiduswriter/Simple-DataTables/wiki

    const initDataTables = (id) => {
        const tableElement = document.getElementById(id);
        if (tableElement) {
            const dataTable = new simpleDatatables.DataTable(tableElement);
            
            // Add Export Buttons
            dataTable.on('datatable.init', () => {
                const wrapper = tableElement.closest('.dataTable-wrapper');
                const topPanel = wrapper.querySelector('.dataTable-top');
                
                if (topPanel) {
                    const btnContainer = document.createElement('div');
                    btnContainer.className = 'export-buttons mt-2 mb-2';
                    btnContainer.style.display = 'inline-block';
                    btnContainer.style.float = 'left';
                    btnContainer.style.marginRight = '10px';
                    
                    btnContainer.innerHTML = `
                        <button class="btn btn-sm btn-success export-excel me-1"><i class="fas fa-file-excel"></i> Excel</button>
                        <button class="btn btn-sm btn-danger export-pdf"><i class="fas fa-file-pdf"></i> PDF</button>
                    `;
                    
                    topPanel.insertBefore(btnContainer, topPanel.firstChild);
                    
                    // Add event listeners for export
                    btnContainer.querySelector('.export-excel').addEventListener('click', (e) => {
                        e.preventDefault();
                        exportExcel(id);
                    });
                    btnContainer.querySelector('.export-pdf').addEventListener('click', (e) => {
                        e.preventDefault();
                        exportPDF(id);
                    });
                }
            });
        }
    };

    initDataTables('datatablesSimple');
    initDataTables('datatablesSimple1');
});

function exportExcel(tableId) {
    if (typeof XLSX === 'undefined') {
        alert('Library Excel tidak ditemukan.');
        return;
    }
    const table = document.getElementById(tableId);
    
    // We clone the table to remove the last column (usually 'Aksi' or Action buttons)
    const clonedTable = table.cloneNode(true);
    const ths = clonedTable.querySelectorAll('th');
    let actionIndex = -1;
    
    ths.forEach((th, index) => {
        if(th.innerText.toLowerCase().includes('aksi') || th.innerText.toLowerCase().includes('action')) {
            actionIndex = index;
        }
    });

    if (actionIndex > -1) {
        clonedTable.querySelectorAll('tr').forEach(row => {
            if(row.children.length > actionIndex) {
                row.removeChild(row.children[actionIndex]);
            }
        });
    }

    const wb = XLSX.utils.table_to_book(clonedTable, {sheet: "Data"});
    XLSX.writeFile(wb, "Data_Export.xlsx");
}

function exportPDF(tableId) {
    if (typeof window.jspdf === 'undefined') {
        alert('Library PDF tidak ditemukan.');
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('l', 'pt', 'a4'); // Landscape, points, A4
    
    const table = document.getElementById(tableId);
    
    // AutoTable can directly take the HTML table
    doc.autoTable({ 
        html: table,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 10 },
        didParseCell: function(data) {
            // Remove the Action column from export
            if (data.column.index === data.table.columns.length - 1 && 
               (data.cell.text[0] === 'Aksi' || data.cell.text[0] === 'Action')) {
                // Not perfectly removing, but a simple heuristic is usually to just not output the last column
                // but jspdf-autotable handles it better if we define columns manually.
                // For simplicity, we just let it render, but let's hide it if header says 'Aksi'
            }
        }
    });
    
    // A better approach for removing the 'Aksi' column in jspdf-autotable:
    // Actually, jspdf-autotable provides an option to ignore certain columns by index or class.
    // We can extract headers and rows manually.
    
    const headers = [];
    const rows = [];
    
    const ths = table.querySelectorAll('thead th');
    let actionIndex = -1;
    
    ths.forEach((th, index) => {
        let text = th.innerText || th.textContent;
        if(text.toLowerCase().includes('aksi') || text.toLowerCase().includes('action')) {
            actionIndex = index;
        } else {
            headers.push(text);
        }
    });
    
    const trs = table.querySelectorAll('tbody tr');
    trs.forEach(tr => {
        const rowData = [];
        const tds = tr.querySelectorAll('td');
        tds.forEach((td, index) => {
            if(index !== actionIndex) {
                rowData.push(td.innerText || td.textContent);
            }
        });
        rows.push(rowData);
    });
    
    const cleanDoc = new jsPDF('l', 'pt', 'a4');
    cleanDoc.text("Data Export", 40, 40);
    cleanDoc.autoTable({
        head: [headers],
        body: rows,
        startY: 50,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 10 }
    });
    
    cleanDoc.save('Data_Export.pdf');
}
