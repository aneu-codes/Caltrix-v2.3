// download pdf
var doc = new jsPDF();
doc.addFileToVFS("Consolas.ttf", "AAEAAAASAQAABAAgR0RFRgAAAAAA6...");
doc.addFont("Consolas.ttf", "Consolas", "normal");
doc.setFont("Consolas");
doc.setFontSize(9);

var specialElementHandlers = {
    '#editor': function (element, renderer) {
        return true;
    }
};

document.querySelector('#pdf').addEventListener('click', function () {
    var content = document.querySelector('#console').value;
    var lines = content.split('\n'); //Divide content in lines

    var x = 15;
    var y = 15;
    var lineHeight = 5.3;
    var pageHeight = doc.internal.pageSize.height;
    //maxLinesPerpage: 50
    var maxLinesPerPage = Math.floor((pageHeight - y) / lineHeight);

    var lineIndex = 0;
    var currentPage = 1;


    while (lineIndex < lines.length) {
        if (lineIndex === 0) {
            doc.addPage();
            currentPage++;
        }

        var linesToShow = lines.slice(lineIndex, lineIndex + maxLinesPerPage);
        var port = "CALTRIX, ACOMPAÑ ANDOTE UN CALCULO MATRICIAL A LA VEZ.\r\r\r";
        var cont = linesToShow.join('\n');
        doc.text(port + cont, x, y);

        lineIndex += maxLinesPerPage;
    }

    doc.save('solution.pdf');
});

//download png
document.getElementById('png').addEventListener('click', function () {
    var content = document.getElementById('console');

    domtoimage.toPng(content).then(function (dataUrl) {
        var link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'solution.png';
        link.click();

    })
        .catch(function (error) {
            console.error('Error para generar imagen PNG: ', error)
        });
});