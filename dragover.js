let dropArea = document.getElementById('dropArea');
let inputFile = document.getElementById('inputFile');

dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropArea.style.borderColor = 'blue';
});

dropArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropArea.style.borderColor = 'black';
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropArea.style.borderColor = 'black';

    let files = e.dataTransfer.files;
    let dataTransfer = new DataTransfer();
    for (let i = 0; i < files.length; i++) {
        dataTransfer.items.add(files[i]);
    }
    inputFile.files = dataTransfer.files;
    showFileNames(files);
});

inputFile.addEventListener('change', () => {
    showFileNames(inputFile.files);
});

let showFileNames = (files) => {
    let text = '';
    for (i = 0; i < files.length; i++)
        text += files[i].name + '<br/>';
    document.getElementById("filesNames").innerHTML = '<h2>Selected files:</h2>\n' + text;
}