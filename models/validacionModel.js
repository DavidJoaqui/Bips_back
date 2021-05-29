const fs = require('fs');
const readline = require('readline');
const moment = require('moment');





module.exports = {

    async validarPlano(nombre_archivo, nombre_plano) {
        //let nombre_plano = nombre_txt.slice(0, 2);
        //console.log("nombre_PLANO:" + nombre_plano);
        if (nombre_plano == 'CT') {
            var res = this.validar_planoCT(nombre_archivo);
            //console.log("NOMBRE2" + nombre_txt);
            //console.log('./filesBipsUploads/' + nombre_archivo);
        }
        if (nombre_plano == 'AC') {
            //console.log("nombre_PLANO:" + nombre_plano);
            var res = this.validar_planoAC(nombre_archivo);
        }
        if (nombre_plano == 'AF') {
            //console.log("nombre_PLANO:" + nombre_plano);
            var res = this.validar_planoAF(nombre_archivo);
        }
        if (nombre_plano == 'AH') {
            //console.log("nombre_PLANO:" + nombre_plano);
            var res = this.validar_planoAH(nombre_archivo);
        }
        if (nombre_plano == 'AP') {
            //console.log("nombre_PLANO:" + nombre_plano);
            var res = this.validar_planoAP(nombre_archivo);
        }
        if (nombre_plano == 'AT') {
            //console.log("nombre_PLANO:" + nombre_plano);
            var res = this.validar_planoAT(nombre_archivo);
        }

        if (nombre_plano == 'AU') {
            //console.log("nombre_PLANO:" + nombre_plano);
            var res = this.validar_planoAU(nombre_archivo);
        }

        if (nombre_plano == 'AN') {
            res = nombre_plano;
        }


        if (nombre_plano == 'US') {
            //console.log("nombre_PLANO:" + nombre_plano);
            var res = this.validar_planoUS(nombre_archivo);
        }

        if (nombre_plano == 'AM') {
            //console.log("nombre_PLANO:" + nombre_plano);
            var res = this.validar_planoAM(nombre_archivo);
        }
        if (nombre_plano == 'AN') {
            //console.log("nombre_PLANO:" + nombre_plano);
            var res = this.validar_planoAN(nombre_archivo);
        }


        return res;
    },

    async validar_planoCT(nombre_archivo) {
        var objplanoct = [];
        var objerr = [];
        //console.log(objerr.length);
        //var elementosRemovidos = objerr.splice(0, objerr.length);
        //console.log("removidos"+elementosRemovidos);
        var fileStream = fs.createReadStream('./filesBipsUploads/' + nombre_archivo);
        var rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        // Note: we use the crlfDelay option to recognize all instances of CR LF
        // ('\r\n') in input.txt as a single line break.
        for await (const line of rl) {
            // Each line in input.txt will be successively available here as `line`.
            let [field_000, field_001, field_002, field_003] = line.split(',');
            objplanoct[Object.values(objplanoct).length] = { field_000, field_001, field_002, field_003 };

            let genregistro = 1;
            objplanoct.forEach(function (dato) {
                dato.linea = genregistro++;
            });
        }

        Object.values(objplanoct).forEach(val => {

            let vf0 = val["field_000"];
            let vf1 = val["field_001"];
            let vf2 = val["field_002"];
            let vf3 = val["field_003"];
            let vflinea = val["linea"];

            if (isNaN(vf0)) {
                let err = "Valor númerico esperado para el campo field_000:" + vf0 + " en la linea " + vflinea;
                //console.log(errvf0);
                objerr.push(err);
            }
            if (!moment(vf1, 'DD/MM/YYYY', true).isValid()) {
                let err = "Fecha esperda formato dd/mm/aaaa esperado para el campo field_001:" + vf1 + " en la linea " + vflinea;
                //console.log(errvf1);
                objerr.push(err);
            }
            /*if (!isNaN(vf2)) {
                let err = "Valor texto esperado para el campo field_002:" + vf2 + " en la linea " + vflinea;
                //console.log(errvf2);
                objerr.push(err);
            }*/
            if (isNaN(vf3)) {
                let err = "Valor númerico esperado para el campo field_003:" + vf3 + " en la linea " + vflinea;
                //console.log(errvf3);
                objerr.push(err);
            }
        });

        return objerr;
    },

    async validar_planoAC(nombre_archivo) {
        var objplanoct = [];
        var objerr = [];
        // console.log(objerr.length);

        var fileStream = fs.createReadStream('./filesBipsUploads/' + nombre_archivo);
        var rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (const line of rl) {

            let [field_000, field_001, field_002, field_003, field_004, field_005, field_006, field_007, field_008, field_009, field_010, field_011, field_012, field_013, field_014, field_015, field_016] = line.split(',');
            objplanoct[Object.values(objplanoct).length] = { field_000, field_001, field_002, field_003, field_004, field_005, field_006, field_007, field_008, field_009, field_010, field_011, field_012, field_013, field_014, field_015, field_016 };

            let genregistro = 1;
            objplanoct.forEach(function (dato) {
                dato.linea = genregistro++;
            });
        }

        //console.log(objplanoct);
        Object.values(objplanoct).forEach(val => {
            let vf0 = val["field_000"];
            let vf1 = val["field_001"];
            let vf2 = val["field_002"];
            let vf3 = val["field_003"];
            let vf4 = val["field_004"];
            let vf5 = val["field_005"];
            let vf6 = val["field_006"];
            let vf7 = val["field_007"];
            let vf8 = val["field_008"];
            let vf9 = val["field_009"];
            let vf10 = val["field_010"];
            let vf11 = val["field_011"];
            let vf12 = val["field_012"];
            let vf13 = val["field_013"];
            let vf14 = val["field_014"];
            let vf15 = val["field_015"];
            let vf16 = val["field_016"];
            let vflinea = val["linea"];

            if (vf0 == '') {
                let err = "Dato Vacio para el campo field_000 en la linea " + vflinea;
                objerr.push(err); 

            }

            if (isNaN(vf1)||vf1 == '') {
                if(vf14 == ''){
                    let err = "Dato Vacio para el campo field_001 en la linea " + vflinea;
                    objerr.push(err); 
                }else {
                    let err = "Valor númerico esperado para el campo field_001:" + vf1 + " en la linea " + vflinea;
                    objerr.push(err); 

                }
            }
            if (vf2 == '') {
                let err = "Dato Vacio para el campo field_002 en la linea " + vflinea;
                objerr.push(err); 

            }

            /*if (isNaN(vf3)||vf3 == '') {
                if(vf14 == ''){
                    let err = "Dato Vacio para el campo field_003 en la linea " + vflinea;
                    objerr.push(err); 
                }else {
                    let err = "Valor númerico esperado para el campo field_003:" + vf3 + " en la linea " + vflinea;
                    objerr.push(err); 

                }
            }*/


            if (!moment(vf4, 'DD/MM/YYYY', true).isValid()||vf4 == '') {
                if(vf4 == ''){
                    let err = "Dato Vacio para el campo field_004 en la linea " + vflinea;
                    objerr.push(err); 
                }
                
                else {  let err = "Fecha esperda formato dd/mm/aaaa esperado para el campo field_004:" + vf4 + " en la linea " + vflinea;
                 objerr.push(err); 
                }

            }
            if (vf6 == '') {
                let err = "Dato Vacio para el campo field_006 en la linea " + vflinea;
                objerr.push(err); 

            }

            /*if (!isNaN(vf5)) {
                let err = "Valor texto esperado para el campo field_005:" + vf5 + " en la linea " + vflinea;
                if(vf5!=''){objerr.push(err);}
            }
            if (!isNaN(vf6)) {
                let err = "Valor texto esperado para el campo field_006:" + vf6 + " en la linea " + vflinea;
                if(vf6!=''){objerr.push(err);}
            }*/
            if (isNaN(vf7)) {
                let err = "Valor númerico esperado para el campo field_007:" + vf7 + " en la linea " + vflinea;
                if (vf7 != '') { objerr.push(err); }
            }
            if (isNaN(vf8)) {
                let err = "Valor númerico esperado para el campo field_008:" + vf8 + " en la linea " + vflinea;
                if (vf8 != '') { objerr.push(err); }
            }
            /*if (!isNaN(vf9)) {
                let err = "Valor texto esperado para el campo field_009:" + vf9 + " en la linea " + vflinea;
                if(vf9!=''){objerr.push(err);}
            }
            if (!isNaN(vf10)) {
                let err = "Valor texto esperado para el campo field_010:" + vf10 + " en la linea " + vflinea;
                if(vf10!=''){objerr.push(err);}
            }
            if (!isNaN(vf11)) {
                let err = "Valor texto esperado para el campo field_011:" + vf11 + " en la linea " + vflinea;
                if(vf11!=''){objerr.push(err);}
            }
            if (!isNaN(vf12)) {
                let err = "Valor texto esperado para el campo field_012:" + vf12 + " en la linea " + vflinea;
                if(vf12!=''){objerr.push(err);}
            }*/
            if (isNaN(vf13)) {
                let err = "Valor númerico esperado para el campo field_013:" + vf13 + " en la linea " + vflinea;
                if (vf13 != '') { objerr.push(err); }
            }
            if (isNaN(vf14)||vf14 == '') {
                if(vf14 == ''){
                    let err = "Dato Vacio para el campo field_014 en la linea " + vflinea;
                    objerr.push(err); 
                }else {
                    let err = "Valor númerico esperado para el campo field_014:" + vf14 + " en la linea " + vflinea;
                    objerr.push(err); 

                }
                
            }
            if (isNaN(vf15)||vf15 == '') {
                if(vf15 == ''){
                    let err = "Dato Vacio para el campo field_015 en la linea " + vflinea;
                    objerr.push(err); 
                }else {
                    let err = "Valor númerico esperado para el campo field_015:" + vf15 + " en la linea " + vflinea;
                    objerr.push(err); 

                }
               
            }
            if (isNaN(vf16)||vf16 == '') {
                if(vf16 == ''){
                    let err = "Dato Vacio para el campo field_016 en la linea " + vflinea;
                    objerr.push(err); 
                }else {
                    let err = "Valor númerico esperado para el campo field_016:" + vf16 + " en la linea " + vflinea;
                    objerr.push(err); 

                }
            }
        });
        return objerr;

    },

    async validar_planoAF(nombre_archivo) {
        var objplanoct = [];
        var objerr = [];
        //console.log(objerr.length);

        var fileStream = fs.createReadStream('./filesBipsUploads/' + nombre_archivo);
        var rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (var line of rl) {

            let [field_000, field_001, field_002, field_003, field_004, field_005, field_006, field_007, field_008, field_009, field_010, field_011, field_012, field_013, field_014, field_015, field_016] = line.split(',');
            objplanoct[Object.values(objplanoct).length] = { field_000, field_001, field_002, field_003, field_004, field_005, field_006, field_007, field_008, field_009, field_010, field_011, field_012, field_013, field_014, field_015, field_016 };

            let genregistro = 1;
            objplanoct.forEach(function (dato) {
                dato.linea = genregistro++;
            });
        }
        //console.log(objplanoct);
        Object.values(objplanoct).forEach(val => {
            let vf0 = val["field_000"];
            let vf5 = val["field_005"];
            let vf6 = val["field_006"];
            let vf7 = val["field_007"];
            let vf13 = val["field_013"];
            let vf14 = val["field_014"];
            let vf15 = val["field_015"];
            let vf16 = val["field_016"];
            let vflinea = val["linea"];

            if (isNaN(vf0)) {
                let err = "Valor númerico esperado para el campo field_000:" + vf0 + " en la linea " + vflinea;
                if (vf0 != '') { objerr.push(err); }
            }
            if (!moment(vf5, 'DD/MM/YYYY', true).isValid()) {
                let err = "Fecha esperda formato dd/mm/aaaa esperado para el campo field_005:" + vf5 + " en la linea " + vflinea;
                if (vf5 != '') { objerr.push(err); }
            }
            if (!moment(vf6, 'DD/MM/YYYY', true).isValid()) {
                let err = "Fecha esperda formato dd/mm/aaaa esperado para el campo field_006:" + vf6 + " en la linea " + vflinea;
                if (vf6 != '') { objerr.push(err); }
            }
            if (!moment(vf7, 'DD/MM/YYYY', true).isValid()) {
                let err = "Fecha esperda formato dd/mm/aaaa esperado para el campo field_007:" + vf7 + " en la linea " + vflinea;
                if (vf7 != '') { objerr.push(err); }
            }
            if (isNaN(vf13)) {
                let err = "Valor númerico esperado para el campo field_013:" + vf13 + " en la linea " + vflinea;
                if (vf13 != '') { objerr.push(err); }
            }
            if (isNaN(vf14)) {
                let err = "Valor númerico esperado para el campo field_014:" + vf14 + " en la linea " + vflinea;
                if (vf14 != '') { objerr.push(err); }
            }
            if (isNaN(vf15)) {
                let err = "Valor númerico esperado para el campo field_015:" + vf15 + " en la linea " + vflinea;
                if (vf15 != '') { objerr.push(err); }
            }
            if (isNaN(vf16)) {
                let err = "Valor númerico esperado para el campo field_016:" + vf16 + " en la linea " + vflinea;
                if (vf16 != '') { objerr.push(err); }
            }



        });
        return objerr;

    },

    async validar_planoAH(nombre_archivo) {
        var objplanoct = [];
        var objerr = [];
        //console.log(objerr.length);

        var fileStream = fs.createReadStream('./filesBipsUploads/' + nombre_archivo);
        var rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (var line of rl) {

            let [field_000, field_001, field_002, field_003, field_004, field_005, field_006, field_007, field_008, field_009, field_010, field_011, field_012, field_013, field_014, field_015, field_016, field_017] = line.split(',');
            objplanoct[Object.values(objplanoct).length] = { field_000, field_001, field_002, field_003, field_004, field_005, field_006, field_007, field_008, field_009, field_010, field_011, field_012, field_013, field_014, field_015, field_016, field_017 };

            let genregistro = 1;
            objplanoct.forEach(function (dato) {
                dato.linea = genregistro++;
            });
        }
        //console.log(objplanoct);
        Object.values(objplanoct).forEach(val => {

            let vf1 = val["field_001"];
            let vf3 = val["field_003"];
            let vf4 = val["field_004"];
            let vf5 = val["field_005"];
            let vf15 = val["field_015"];
            let vf16 = val["field_016"];
            let vflinea = val["linea"];

            if (isNaN(vf1)) {
                let err = "Valor númerico esperado para el campo field_001:" + vf1 + " en la linea " + vflinea;
                if (vf1 != '') { objerr.push(err); }
            }
            /*if (isNaN(vf3)) {
                let err = "Valor númerico esperado para el campo field_003:" + vf3 + " en la linea " + vflinea;
                if (vf3 != '') { objerr.push(err); }
            }*/

            if (isNaN(vf4)) {
                let err = "Valor númerico esperado para el campo field_004:" + vf4 + " en la linea " + vflinea;
                if (vf4 != '') { objerr.push(err); }
            }
            if (!moment(vf5, 'DD/MM/YYYY', true).isValid()) {
                let err = "Fecha esperda formato dd/mm/aaaa esperado para el campo field_005:" + vf5 + " en la linea " + vflinea;
                if (vf5 != '') { objerr.push(err); }
            }
            if (isNaN(vf15)) {
                let err = "Valor númerico esperado para el campo field_015:" + vf15 + " en la linea " + vflinea;
                if (vf15 != '') { objerr.push(err); }
            }
            if (!moment(vf16, 'DD/MM/YYYY', true).isValid()) {
                let err = "Fecha esperda formato dd/mm/aaaa esperado para el campo field_016:" + vf16 + " en la linea " + vflinea;
                if (vf16 != '') { objerr.push(err); }
            }

        });
        return objerr;

    },

    async validar_planoAP(nombre_archivo) {
        var objplanoct = [];
        var objerr = [];
        //console.log(objerr.length);

        var fileStream = fs.createReadStream('./filesBipsUploads/' + nombre_archivo);
        var rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (var line of rl) {

            let [field_000, field_001, field_002, field_003, field_004, field_005, field_006, field_007, field_008, field_009, field_010, field_011, field_012, field_013, field_014] = line.split(',');
            objplanoct[Object.values(objplanoct).length] = { field_000, field_001, field_002, field_003, field_004, field_005, field_006, field_007, field_008, field_009, field_010, field_011, field_012, field_013, field_014 };

            let genregistro = 1;
            objplanoct.forEach(function (dato) {
                dato.linea = genregistro++;
            });
        }
        //console.log(objplanoct);
        Object.values(objplanoct).forEach(val => {

            let vf1 = val["field_001"];
            let vf3 = val["field_003"];
            let vf4 = val["field_004"];
            let vf7 = val["field_007"];
            let vf8 = val["field_008"];
            let vf9 = val["field_009"];
            let vf13 = val["field_013"];
            let vf14 = val["field_014"];


            let vflinea = val["linea"];

            if (isNaN(vf1)) {
                let err = "Valor númerico esperado para el campo field_001:" + vf1 + " en la linea " + vflinea;
                if (vf1 != '') { objerr.push(err); }
            }
            /*if (isNaN(vf3)) {
                let err = "Valor númerico esperado para el campo field_003:" + vf3 + " en la linea " + vflinea;
                if (vf3 != '') { objerr.push(err); }
            }*/

            if (!moment(vf4, 'DD/MM/YYYY', true).isValid()) {
                let err = "Fecha esperda formato dd/mm/aaaa esperado para el campo field_004:" + vf4 + " en la linea " + vflinea;
                if (vf4 != '') { objerr.push(err); }
            }
            if (isNaN(vf7)) {
                let err = "Valor númerico esperado para el campo field_007:" + vf7 + " en la linea " + vflinea;
                if (vf7 != '') { objerr.push(err); }
            }
            if (isNaN(vf8)) {
                let err = "Valor númerico esperado para el campo field_008:" + vf8 + " en la linea " + vflinea;
                if (vf8 != '') { objerr.push(err); }
            }
            if (isNaN(vf9)) {
                let err = "Valor númerico esperado para el campo field_009:" + vf9 + " en la linea " + vflinea;
                if (vf9 != '') { objerr.push(err); }
            }
            if (isNaN(vf13)) {
                let err = "Valor númerico esperado para el campo field_013:" + vf13 + " en la linea " + vflinea;
                if (vf13 != '') { objerr.push(err); }
            }

            if (isNaN(vf14)) {
                let err = "Valor númerico esperado para el campo field_014:" + vf14 + " en la linea " + vflinea;
                if (vf14 != '') { objerr.push(err); }
            }

        });
        return objerr;

    },
    async validar_planoAT(nombre_archivo) {
        var objplanoct = [];
        var objerr = [];
        //console.log(objerr.length);

        var fileStream = fs.createReadStream('./filesBipsUploads/' + nombre_archivo);
        var rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (var line of rl) {

            let [field_000, field_001, field_002, field_003, field_004, field_005, field_006, field_007, field_008, field_009, field_010] = line.split(',');
            objplanoct[Object.values(objplanoct).length] = { field_000, field_001, field_002, field_003, field_004, field_005, field_006, field_007, field_008, field_009, field_010 };

            let genregistro = 1;
            objplanoct.forEach(function (dato) {
                dato.linea = genregistro++;
            });
        }
        //  console.log(objplanoct);
        Object.values(objplanoct).forEach(val => {

            let vf1 = val["field_001"];
            let vf3 = val["field_003"];
            let vf5 = val["field_005"];
            let vf8 = val["field_008"];
            let vf9 = val["field_009"];
            let vf10 = val["field_010"];
            let vflinea = val["linea"];

            if (isNaN(vf1)) {
                let err = "Valor númerico esperado para el campo field_001:" + vf1 + " en la linea " + vflinea;
                if (vf1 != '') { objerr.push(err); }
            }
            /*if (isNaN(vf3)) {
                let err = "Valor númerico esperado para el campo field_003:" + vf3 + " en la linea " + vflinea;
                if (vf3 != '') { objerr.push(err); }
            }*/

            if (isNaN(vf5)) {
                let err = "Valor númerico esperado para el campo field_005:" + vf5 + " en la linea " + vflinea;
                if (vf5 != '') { objerr.push(err); }
            }
            if (isNaN(vf8)) {
                let err = "Valor númerico esperado para el campo field_008:" + vf8 + " en la linea " + vflinea;
                if (vf8 != '') { objerr.push(err); }
            }
            if (isNaN(vf9)) {
                let err = "Valor númerico esperado para el campo field_009:" + vf9 + " en la linea " + vflinea;
                if (vf9 != '') { objerr.push(err); }
            }
            if (isNaN(vf10)) {
                let err = "Valor númerico esperado para el campo field_010:" + vf10 + " en la linea " + vflinea;
                if (vf10 != '') { objerr.push(err); }
            }
        });
        return objerr;

    },

    async validar_planoAU(nombre_archivo) {
        var objplanoct = [];
        var objerr = [];
        //console.log(objerr.length);

        var fileStream = fs.createReadStream('./filesBipsUploads/' + nombre_archivo);
        var rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (var line of rl) {

            let [field_000, field_001, field_002, field_003, field_004, field_005, field_006, field_007, field_008, field_009, field_010, field_011, field_012, field_013, field_014, field_015, field_016] = line.split(',');
            objplanoct[Object.values(objplanoct).length] = { field_000, field_001, field_002, field_003, field_004, field_005, field_006, field_007, field_008, field_009, field_010, field_011, field_012, field_013, field_014, field_015, field_016 };

            let genregistro = 1;
            objplanoct.forEach(function (dato) {
                dato.linea = genregistro++;
            });
        }
        //console.log(objplanoct);
        Object.values(objplanoct).forEach(val => {

            let vf1 = val["field_001"];
            let vf3 = val["field_003"];
            let vf13 = val["field_013"];
            let vf14 = val["field_014"];
            let vf15 = val["field_015"];
            let vflinea = val["linea"];

            if (isNaN(vf1)) {
                let err = "Valor númerico esperado para el campo field_001:" + vf1 + " en la linea " + vflinea;
                if (vf1 != '') { objerr.push(err); }
            }
            /*if (isNaN(vf3)) {
                let err = "Valor númerico esperado para el campo field_003:" + vf3 + " en la linea " + vflinea;
                if (vf3 != '') { objerr.push(err); }
            }*/


            if (isNaN(vf13)) {
                let err = "Valor númerico esperado para el campo field_013:" + vf13 + " en la linea " + vflinea;
                if (vf13 != '') { objerr.push(err); }
            }

            if (isNaN(vf14)) {
                let err = "Valor númerico esperado para el campo field_014:" + vf14 + " en la linea " + vflinea;
                if (vf14 != '') { objerr.push(err); }
            }
            if (!moment(vf15, 'DD/MM/YYYY', true).isValid()) {
                let err = "Fecha esperda formato dd/mm/aaaa esperado para el campo field_015:" + vf15 + " en la linea " + vflinea;
                if (vf15 != '') { objerr.push(err); }
            }

        });
        return objerr;

    },

    async validar_planoAM(nombre_archivo) {
        var objplanoct = [];
        var objerr = [];
        //console.log(objerr.length);

        var fileStream = fs.createReadStream('./filesBipsUploads/' + nombre_archivo);
        var rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (var line of rl) {

            let [field_000, field_001, field_002, field_003, field_004, field_005, field_006, field_007, field_008, field_009, field_010, field_011, field_012, field_013] = line.split(',');
            objplanoct[Object.values(objplanoct).length] = { field_000, field_001, field_002, field_003, field_004, field_005, field_006, field_007, field_008, field_009, field_010, field_011, field_012, field_013 };

            let genregistro = 1;
            objplanoct.forEach(function (dato) {
                dato.linea = genregistro++;
            });
        }
        //  console.log(objplanoct);
        Object.values(objplanoct).forEach(val => {

            let vf1 = val["field_001"];
            let vf3 = val["field_003"];
            let vf6 = val["field_006"];
            let vf11 = val["field_011"];
            let vf12 = val["field_012"];
            let vf13 = val["field_013"];
            let vflinea = val["linea"];

            if (isNaN(vf1)) {
                let err = "Valor númerico esperado para el campo field_001:" + vf1 + " en la linea " + vflinea;
                if (vf1 != '') { objerr.push(err); }
            }
            /*if (isNaN(vf3)) {
                let err = "Valor númerico esperado para el campo field_003:" + vf3 + " en la linea " + vflinea;
                if (vf3 != '') { objerr.push(err); }
            }*/

            if (isNaN(vf6)) {
                let err = "Valor númerico esperado para el campo field_006:" + vf6 + " en la linea " + vflinea;
                if (vf6 != '') { objerr.push(err); }
            }
            if (isNaN(vf11)) {
                let err = "Valor númerico esperado para el campo field_011:" + vf11 + " en la linea " + vflinea;
                if (vf11 != '') { objerr.push(err); }
            }
            if (isNaN(vf12)) {
                let err = "Valor númerico esperado para el campo field_012:" + vf12 + " en la linea " + vflinea;
                if (vf12 != '') { objerr.push(err); }
            }
            if (isNaN(vf13)) {
                let err = "Valor númerico esperado para el campo field_013:" + vf13 + " en la linea " + vflinea;
                if (vf13 != '') { objerr.push(err); }
            }



        });
        return objerr;

    },


    async validar_planoAN(nombre_archivo) {
        var objplanoct = [];
        var objerr = [];
        //console.log(objerr.length);

        var fileStream = fs.createReadStream('./filesBipsUploads/' + nombre_archivo);
        var rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (var line of rl) {

            let [field_000, field_001, field_002, field_003, field_004, field_005, field_006, field_007, field_008, field_009, field_010, field_011, field_012, field_013] = line.split(',');
            objplanoct[Object.values(objplanoct).length] = { field_000, field_001, field_002, field_003, field_004, field_005, field_006, field_007, field_008, field_009, field_010, field_011, field_012, field_013 };

            let genregistro = 1;
            objplanoct.forEach(function (dato) {
                dato.linea = genregistro++;
            });
        }
        //  console.log(objplanoct);
        Object.values(objplanoct).forEach(val => {

            let vf1 = val["field_001"];
            let vf3 = val["field_003"];
            let vf4 = val["field_004"];
            let vf6 = val["field_006"];
            let vf12 = val["field_012"];
            let vflinea = val["linea"];

            if (isNaN(vf1)) {
                let err = "Valor númerico esperado para el campo field_001:" + vf1 + " en la linea " + vflinea;
                if (vf1 != '') { objerr.push(err); }
            }
            /*if (isNaN(vf3)) {
                let err = "Valor númerico esperado para el campo field_003:" + vf3 + " en la linea " + vflinea;
                if (vf3 != '') { objerr.push(err); }
            }*/

            if (!moment(vf4, 'DD/MM/YYYY', true).isValid()) {
                let err = "Fecha esperda formato dd/mm/aaaa esperado para el campo field_004:" + vf4 + " en la linea " + vflinea;
                if (vf4 != '') { objerr.push(err); }
            }
            if (isNaN(vf6)) {
                let err = "Valor númerico esperado para el campo field_006:" + vf6 + " en la linea " + vflinea;
                if (vf6 != '') { objerr.push(err); }
            }
            if (!moment(vf12, 'DD/MM/YYYY', true).isValid()) {
                let err = "Fecha esperda formato dd/mm/aaaa esperado para el campo field_012:" + vf12 + " en la linea " + vflinea;
                if (vf12 != '') { objerr.push(err); }
            }


        });
        return objerr;

    },

    async validar_planoUS(nombre_archivo) {
        var objplanoct = [];
        var objerr = [];
        //  console.log(objerr.length);

        var fileStream = fs.createReadStream('./filesBipsUploads/' + nombre_archivo);
        var rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (var line of rl) {

            let [field_000, field_001, field_002, field_003, field_004, field_005, field_006, field_007, field_008, field_009, field_010, field_011, field_012, field_013] = line.split(',');
            objplanoct[Object.values(objplanoct).length] = { field_000, field_001, field_002, field_003, field_004, field_005, field_006, field_007, field_008, field_009, field_010, field_011, field_012, field_013 };

            let genregistro = 1;
            objplanoct.forEach(function (dato) {
                dato.linea = genregistro++;
            });
        }
        //  console.log(objplanoct);
        Object.values(objplanoct).forEach(val => {

            let vf1 = val["field_001"];
            let vf3 = val["field_003"];
            let vf8 = val["field_008"];
            let vf9 = val["field_009"];
            let vf11 = val["field_011"];
            let vf12 = val["field_012"];
            let vflinea = val["linea"];

            /*if (isNaN(vf1)) {
                let err = "Valor númerico esperado para el campo field_001:" + vf1 + " en la linea " + vflinea;
                if (vf1 != '') { objerr.push(err); }
            }*/

            if (isNaN(vf3)) {
                let err = "Valor númerico esperado para el campo field_003:" + vf3 + " en la linea " + vflinea;
                if (vf3 != '') { objerr.push(err); }
            }

            if (isNaN(vf8)) {
                let err = "Valor númerico esperado para el campo field_008:" + vf8 + " en la linea " + vflinea;
                if (vf8 != '') { objerr.push(err); }
            }
            if (isNaN(vf9)) {
                let err = "Valor númerico esperado para el campo field_009:" + vf9 + " en la linea " + vflinea;
                if (vf9 != '') { objerr.push(err); }
            }
            if (isNaN(vf11)) {
                let err = "Valor númerico esperado para el campo field_011:" + vf11 + " en la linea " + vflinea;
                if (vf11 != '') { objerr.push(err); }
            }
            if (isNaN(vf12)) {
                let err = "Valor númerico esperado para el campo field_012:" + vf12 + " en la linea " + vflinea;
                if (vf12 != '') { objerr.push(err); }
            }




        });
        return objerr;

    }





}