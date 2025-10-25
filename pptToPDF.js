const { jsPDF } = window.jspdf;

document.getElementById("convertBtn").addEventListener("click", async () => {
    const files = document.getElementById("inputFile").files;

    if (files.length === 0) {
        alert("Please select slide images exported from PPT/PPTX.");
        return;
    }

    const pdf = new jsPDF('landscape', 'pt', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        await new Promise((resolve) => {
            reader.onload = function (e) {
                const imgData = e.target.result;
                if (i > 0) pdf.addPage();
                pdf.addImage(imgData, file.name.endsWith(".png") ? 'PNG' : 'JPEG', 0, 0, pageWidth, pageHeight);
                resolve();
            };
            reader.readAsDataURL(file);
        });
    }

    pdf.save("presentation.pdf");
});