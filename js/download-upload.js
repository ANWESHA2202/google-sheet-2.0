let downloadBtn = document.querySelector(".download");
let uploadBtn = document.querySelector(".upload");

downloadBtn.addEventListener("click", (e) => {
    let jsonData = JSON.stringify([sheetDB, graphComponentMatrix]);
    let file = new Blob([jsonData], { type: 'application/json' });

    let a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = "SheetData.json";
    a.click();
})

uploadBtn.addEventListener("click", (e) => {
    let input = document.createElement("input");
    input.type = "file";

    input.click();

    input.addEventListener("change", (e) => {
        let fr = new FileReader();
        let files = input.files;
        let fileObj = files[0];

        fr.readAsText(fileObj);
        fr.addEventListener("load", (e) => {
            let jsonData = JSON.parse(fr.result);

            sheetDB = jsonData[0];
            graphComponentMatrix = jsonData[1];

            collectedSheetDB.push(sheetDB);
            collectedGraphComponentMatrix.push(graphComponentMatrix);


            addSheetBtn.click()

            // sheetDB = jsonData[0];
            // graphComponentMatrix = jsonData[1];

            // collectedSheetDB[collectedSheetDB.length - 1] = sheetDB;
            // collectedGraphComponentMatrix[collectedGraphComponentMatrix.length - 1] = graphComponentMatrix;


        })
    })
})