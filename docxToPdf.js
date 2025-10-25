let { jsPDF } = window.jspdf;

document.getElementById("convertBtn").addEventListener("click", async () => {
    let fileInput = document.getElementById("inputFile");
    let file = fileInput.files[0];
    let status = document.getElementById("status");
    let preview = document.getElementById("preview");
    preview.innerHTML = '';
    status.textContent = '';

    if (!file) {
        status.textContent = "❌ Please select a DOCX file.";
        return;
    }

    try {
        status.textContent = "📄 Reading DOCX file...";

        // Read DOCX as ArrayBuffer
        let arrayBuffer = await file.arrayBuffer();

        // Convert DOCX → HTML
        let result = await mammoth.convertToHtml({
            arrayBuffer,
            styleMap: [
                "p => p:fresh",
                "r => span"
            ]
        });

        // Show preview
        preview.innerHTML = result.value;

        // Apply Word-like styles
        preview.style.fontFamily = "Times New Roman, serif";
        preview.style.fontSize = "12pt";
        preview.style.lineHeight = "1.2";

        status.textContent = "🖨 Converting to PDF...";

        // Create jsPDF
        let pdf = new jsPDF({
            unit: "pt",
            format: "a4"
        });

        // Generate unique filename to avoid overwrite
        let timestamp = new Date().getTime();
        let pdfFileName = file.name.replace(/\.docx$/, `_${timestamp}.pdf`);

        // Convert HTML → PDF
        await pdf.html(preview, {
            margin: [40, 40, 40, 40], // left, top, right, bottom
            html2canvas: { scale: 1 }, // preserve font size
            autoPaging: "text",
            callback: function (pdf) {
                pdf.save(pdfFileName);
                status.textContent = `✅ PDF ready! Saved as: ${pdfFileName}`;
            }
        });

    } catch (err) {
        console.error(err);
        status.textContent = "❌ Error: " + err.message;
    }
});