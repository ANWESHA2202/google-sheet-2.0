let sheetsFolderCont = document.querySelector(".sheets-folder-cont");
let addSheetBtn = document.querySelector(".sheet-add-icon");

addSheetBtn.addEventListener("click", function() {
    let sheet = document.createElement("div");
    sheet.setAttribute("class", "sheet-folder");
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    sheet.setAttribute("sheetIdx", allSheetFolders.length);
    sheet.innerHTML = `<div class="sheet-content">Sheet ${allSheetFolders.length + 1}</div>`;

    sheetsFolderCont.appendChild(sheet);
    sheet.scrollIntoView();
    createSheetDB();
    createGraphComponentMatrix();
    handleSheetActivity(sheet);
    handleSheetRemoval(sheet);
    sheet.click();
})

function handleSheetRemoval(sheet) {
    sheet.addEventListener('mousedown', (e) => {
        if (e.button !== 2) {
            return
        }
        let allSheetFolders = document.querySelectorAll(".sheet-folder");
        if (allSheetFolders.length === 1) {
            alert("Can't delete the last sheet");
            return
        }
        let response = confirm("Are you sure you want to delete this sheet?");
        if (response === false) return;
        let sheetIdx = Number(sheet.getAttribute("sheetIdx"));
        if (response === true) {
            collectedSheetDB.splice(sheetIdx, 1);
            collectedGraphComponentMatrix.splice(sheetIdx, 1);
            handleSheetUIRemoval(sheet)
            sheetDB = collectedSheetDB[0];
            graphComponentMatrix = collectedGraphComponentMatrix[0];
            handleSheetProperties();
        }

    })
}

function handleSheetUIRemoval(sheet) {
    sheet.remove();
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for (let i = 0; i < allSheetFolders.length; i++) {
        allSheetFolders[i].setAttribute("sheetIdx", i);
        let sheetContent = allSheetFolders[i].querySelector(".sheet-content");
        sheetContent.innerText = `Sheet${i + 1}`;
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    allSheetFolders[0].style.backgroundColor = "#ced6e0";
}

function handleSheetDB(sheetIdx) {
    sheetDB = collectedSheetDB[sheetIdx];
    graphComponentMatrix = collectedGraphComponentMatrix[sheetIdx];
}

function handleSheetProperties() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            cell.click()
        }
    }
    let firstCell = document.querySelector(".cell");
    firstCell.click();
    firstCell.focus();
}

function handleSheetActivity(sheet) {
    sheet.addEventListener("click", function(e) {
        let sheetIdx = Number(sheet.getAttribute("sheetIdx"));
        handleSheetDB(sheetIdx)
        handleSheetProperties();
        handleSheetUI(sheet);
    })
}

function handleSheetUI(sheet) {
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for (let i = 0; i < allSheetFolders.length; i++) {
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    sheet.style.backgroundColor = "#ced6e0";

}

function createSheetDB() {
    let sheetDB = []

    for (let i = 0; i < rows; i++) {
        let sheetRow = []
        for (let j = 0; j < cols; j++) {
            let cellprop = {
                bold: false,
                italic: false,
                underline: false,
                fontFamily: "monospace",
                fontSize: "14",
                alignment: "left",
                fontColor: '#000000',
                bgColor: '#ecf0f1',
                value: "",
                formula: "",
                children: []
            }
            sheetRow.push(cellprop)
        }
        sheetDB.push(sheetRow)
    }
    collectedSheetDB.push(sheetDB);
}


function createGraphComponentMatrix() {

    let graphComponentMatrix = []
    for (let i = 0; i < rows; i++) {
        let row = []
        for (let j = 0; j < cols; j++) {
            row.push([])
        }
        graphComponentMatrix.push(row)
    }
    collectedGraphComponentMatrix.push(graphComponentMatrix);
}