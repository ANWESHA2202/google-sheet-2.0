let ctrlKey;
let rangeStorage = [];

let copyBtn = document.querySelector('.copy');
let cutBtn = document.querySelector('.cut');
let pasteBtn = document.querySelector('.paste');


document.addEventListener('keydown', (event) => {
    ctrlKey = event.ctrlKey;
})
document.addEventListener('keyup', (event) => {
    ctrlKey = event.ctrlKey;
})

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        handleSelectorCells(cell)

    }
}

function handleSelectorCells(cell) {
    cell.addEventListener('click', (e) => {
        if (!ctrlKey) return;

        if (rangeStorage.length >= 2) {
            handleSelectedCellUI();
            rangeStorage = []

        }

        let rid = Number(cell.getAttribute('rid'));
        let cid = Number(cell.getAttribute('cid'));

        cell.style.border = '2px solid #218c74';

        rangeStorage.push([rid, cid]);

    })
}

function handleSelectedCellUI() {
    for (let i = 0; i < rangeStorage.length; i++) {
        let cell = document.querySelector(`.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`)
        cell.style.border = '1px solid lightgrey'
    }
}


let copyData = []
copyBtn.addEventListener('click', (e) => {
    if (rangeStorage.length < 2) return;
    copyData = [];
    let strow = Math.min(rangeStorage[0][0], rangeStorage[1][0]);
    let enrow = Math.max(rangeStorage[0][0], rangeStorage[1][0]);
    let stcol = Math.min(rangeStorage[0][1], rangeStorage[1][1]);
    let encol = Math.max(rangeStorage[0][1], rangeStorage[1][1]);

    for (let i = strow; i <= enrow; i++) {
        let copyRow = [];
        for (let j = stcol; j <= encol; j++) {
            let cellProp = sheetDB[i][j];
            copyRow.push(cellProp);
        }
        copyData.push(copyRow);
    }
    handleSelectedCellUI();

})

cutBtn.addEventListener('click', (e) => {
    if (rangeStorage.length < 2) return;
    copyData = [];
    let strow = Math.min(rangeStorage[0][0], rangeStorage[1][0]);
    let enrow = Math.max(rangeStorage[0][0], rangeStorage[1][0]);
    let stcol = Math.min(rangeStorage[0][1], rangeStorage[1][1]);
    let encol = Math.max(rangeStorage[0][1], rangeStorage[1][1]);

    for (let i = strow; i <= enrow; i++) {
        let copyRow = [];
        for (let j = stcol; j <= encol; j++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);

            let cellProp = sheetDB[i][j];
            copyRow.push(sheetDB[i][j]);
            cellProp.value = '';
            cellProp.bold = false;
            cellProp.italic = false;
            cellProp.underline = false;
            cellProp.fontSize = '14';
            cellProp.fontFamily = 'monospace';
            cellProp.fontColor = '#000000';
            cellProp.bgColor = '#ecf0f1';
            cellProp.alignment = 'left';


            cell.click()

        }
        copyData.push(copyRow);

    }
    handleSelectedCellUI();
});

pasteBtn.addEventListener('click', (e) => {

    if (rangeStorage.length < 2) return;
    console.log(copyData);
    let rowDiff = Math.max(rangeStorage[0][0], rangeStorage[1][0]) - Math.min(rangeStorage[0][0], rangeStorage[1][0]);
    let colDiff = Math.max(rangeStorage[0][1], rangeStorage[1][1]) - Math.min(rangeStorage[0][1], rangeStorage[1][1]);

    let address = addressBar.value;
    let [strow, stcol] = decodeRidCidFromAddress(address);

    for (let i = strow, r = 0; i <= strow + rowDiff; i++, r++) {
        for (let j = stcol, c = 0; j <= stcol + colDiff; j++, c++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);

            if (!cell) continue;

            let cellProp = sheetDB[i][j];
            cellProp.value = copyData[r][c].value;
            cellProp.bold = copyData[r][c].bold;
            cellProp.italic = copyData[r][c].italic;
            cellProp.underline = copyData[r][c].underline;
            cellProp.fontSize = copyData[r][c].fontSize;
            cellProp.fontFamily = copyData[r][c].fontFamily;
            cellProp.fontColor = copyData[r][c].fontColor;
            cellProp.bgColor = copyData[r][c].bgColor;
            cellProp.alignment = copyData[r][c].alignment;


            cell.click();
        }
    }
})