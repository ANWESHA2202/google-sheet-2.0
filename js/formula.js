for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur", (e) => {
            console.log(e.target.innerText);
            let address = addressBar.value;
            let [activecell, cellProp] = activeCell(address);
            let enteredData = e.target.innerText;
            if (enteredData === cellProp.value) return;
            cellProp.value = enteredData;
            removeChildFromParent(cellProp.formula);
            cellProp.formula = "";
            updateChildrenCells(address);
        })

    }
}

let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", async(e) => {
    let inputFormula = formulaBar.value;
    if (e.key === 'Enter' && inputFormula) {

        let address = addressBar.value;
        let [cell, cellProp] = activeCell(address);
        if (inputFormula != cellProp.formula) {
            removeChildFromParent(cellProp.formula);
        }
        addChildToGraphComponent(inputFormula, address);
        let cycleResponse = isGraphCyclic(graphComponentMatrix);

        if (cycleResponse) {
            let response = confirm('Cyclic dependency found in your formulae, Do you want to trace the path?')
            while (response === true) {
                await isGraphCyclicTracePath(graphComponentMatrix, cycleResponse);
                response = confirm('Cyclic dependency found in your formulae, Do you want to trace the path?');
            }
            removeChildFromGraphComponent(inputFormula, address)
            return;
        }
        let evaluatedValue = evaluateFormula(inputFormula);

        setCellUIAndCellProp(evaluatedValue, inputFormula, address);
        addChildToParent(inputFormula);
        updateChildrenCells(address);
    }
})

function addChildToGraphComponent(formula, childAddress) {
    let [crid, ccid] = decodeRidCidFromAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let ascii = encodedFormula[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let [prid, pcid] = decodeRidCidFromAddress(encodedFormula[i]);
            graphComponentMatrix[prid][pcid].push([crid, ccid]);
        }
    }

}

function removeChildFromGraphComponent(formula, childAddress) {
    let [crid, ccid] = decodeRidCidFromAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let ascii = encodedFormula[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let [prid, pcid] = decodeRidCidFromAddress(encodedFormula[i]);
            graphComponentMatrix[prid][pcid].pop();
        }
    }
}

function updateChildrenCells(parentAddress) {
    let [parentCell, parentCellProp] = activeCell(parentAddress);
    let children = parentCellProp.children;

    for (let i = 0; i < children.length; i++) {
        let childAddress = children[i];
        let [childCell, childCellProp] = activeCell(childAddress);
        let childFormula = childCellProp.formula;
        let evaluatedValue = evaluateFormula(childFormula);
        setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);
        updateChildrenCells(childAddress);
    }
}

function addChildToParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    console.log(encodedFormula, 'encoded formula');
    for (let i = 0; i < encodedFormula.length; i++) {
        let ascii = encodedFormula[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let [parentCell, parentCellProp] = activeCell(encodedFormula[i]);
            parentCellProp.children.push(childAddress);
        }
    }
}

function removeChildFromParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");

    for (let i = 0; i < encodedFormula.length; i++) {
        let ascii = encodedFormula[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let [parentCell, parentCellProp] = activeCell(encodedFormula[i]);
            let idx = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx, 1);
        }
    }
}

function evaluateFormula(formula) {
    let encodedFormula = formula.split(" ");
    console.log(encodedFormula, 'encoded formula');
    for (let i = 0; i < encodedFormula.length; i++) {
        let ascii = encodedFormula[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let [cell, cellProp] = activeCell(encodedFormula[i]);
            encodedFormula[i] = cellProp.value;
        }
    }
    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula)
}

function setCellUIAndCellProp(evaluatedValue, formula, address) {

    let [cell, cellProp] = activeCell(address);
    cell.innerText = evaluatedValue;
    cellProp.value = evaluatedValue;
    cellProp.formula = formula;
}