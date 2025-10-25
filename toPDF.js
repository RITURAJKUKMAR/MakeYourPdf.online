const { jsPDF } = window.jspdf;

const PAGE_SIZES_MM = { a4: { w: 210, h: 297 } };
const DEFAULT_DPI = 96;

document.getElementById("convertBtn").addEventListener("click", async () => {
    const input = document.getElementById("inputFile");
    const status = document.getElementById("status");
    const files = Array.from(input.files);

    status.innerHTML = '';

    if (!files.length) {
        alert("Please select at least one image or text file.");
        status.textContent = "Please select at least one image or text file.";
        return;
    }

    const pageSize = PAGE_SIZES_MM.a4;
    const pdf = new jsPDF({ unit: "mm", format: [pageSize.w, pageSize.h] });
    const margin = 10;
    let yPos = margin;

    const pageHeight = pageSize.h;
    const lineHeight = 7;
    const textMargin = 15;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        status.textContent = `Processing ${i + 1} of ${files.length}: ${file.name}`;

        try {
            if (file.type.startsWith("image/")) {
                // --- IMAGE HANDLING ---
                const img = await loadImageFromFile(file);
                const maxWidth = pageSize.w - 2 * margin;
                const imgRatio = img.naturalWidth / img.naturalHeight;
                const imgW = maxWidth;
                const imgH = imgW / imgRatio;

                if (yPos + imgH + margin > pageHeight) {
                    pdf.addPage([pageSize.w, pageSize.h]);
                    yPos = margin;
                }

                pdf.addImage(img, "JPEG", margin, yPos, imgW, imgH);
                yPos += imgH + margin;
            }
            else if (file.type === "text/plain") {
                const text = await file.text();
                const lines = pdf.splitTextToSize(text, pageSize.w - 2 * textMargin);

                for (let j = 0; j < lines.length; j++) {
                    if (yPos + lineHeight > pageHeight - margin) {
                        pdf.addPage([pageSize.w, pageSize.h]);
                        yPos = textMargin;
                    }
                    pdf.text(lines[j], textMargin, yPos);
                    yPos += lineHeight;
                }
                yPos += lineHeight;
            }
            else {
                console.warn(`Skipping unsupported file: ${file.name}`);
            }

        } catch (err) {
            console.error("Error processing", file.name, err);
            status.innerHTML += `<p style="color:red;">Error processing ${file.name}: ${err.message}</p>`;
        }
    }

    const outName = "merged_files.pdf";
    pdf.save(outName);
    status.innerHTML = `<p>✅ Done! Downloaded <b>${outName}</b></p>`;
    document.getElementById("inputFile").value = "";
    document.getElementById("filesNames").innerHTML = "";
});

function loadImageFromFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error("Invalid image or unsupported format"));
            img.src = reader.result;
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
    });
}
