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

function extraerData(error) {
    for (let i = 0; i < error.length; i++) {

        var obj = error[i];
        id = obj["id"];
        name = obj["name"];
        age = obj["age"];
        let dts = new Array(id, name, age);

        //arr_errores.push(id, name, age);
        arr_errores.push(i + 1, obj);
        //cadena = cadena + i + 1, obj[i];
        //arr_errores.push(dts);
        /*for (var key in obj) {
            var value = obj[key];

            console.log("item " + i + " clave " + key + " valor: " + value);
            //console.log(key.id + key.name + key.age);
            //return [error.id, error.name, error.age];
            //return [ key , valor];
            //                return [obj["id"], obj["name"], obj["age"]];
        }*/

        //return [obj["id"], obj["name"], obj["age"]];
    }
}

module.exports = exportErrorsToExcel;