const mergeBtn = document.getElementById('convertBtn');
const status = document.getElementById('status');

mergeBtn.addEventListener('click', async () => {
    if (typeof PDFLib === 'undefined') {
        alert('⚠️ PDFLib failed to load. Check internet connection or CDN.');
        return;
    }

    const files = document.getElementById('inputFile').files;
    if (!files.length) {
        alert('Please select at least two PDF files.');
        return;
    }

    status.textContent = 'Merging... please wait ⏳';

    try {
        const mergedPdf = await PDFLib.PDFDocument.create();

        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach(page => mergedPdf.addPage(page));
        }

        const mergedBytes = await mergedPdf.save();
        const blob = new Blob([mergedBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'merged.pdf';
        a.click();

        URL.revokeObjectURL(url);
        status.textContent = '✅ Merging complete!';
    } catch (err) {
        console.error(err);
        status.textContent = '❌ Error merging PDFs. Check console.';
    }
});
