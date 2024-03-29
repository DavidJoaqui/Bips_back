const xlsx = require('xlsx');
const path = require('path');

const exportExcel = (data, workSheetColumnNames, workSheetName, filePath) => {
    const workBook = xlsx.utils.book_new();
    const workSheetData = [
        workSheetColumnNames,
        ...data
    ];
    const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
    xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
    xlsx.writeFile(workBook, path.resolve(filePath));
}

const exportErrorsToExcel = (errores, workSheetColumnNames, workSheetName, filePath) => {

    var i = -1;
    const data = errores.map(err => {

        //console.log([i + 1, errores[i]]);
        i++;
        return [i + 1, errores[i]];
    });

    exportExcel(data, workSheetColumnNames, workSheetName, filePath);

}

module.exports = exportErrorsToExcel;