const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");
const modelControlMando = require("../models/controlMandoModel");
const path = require("path");
const fs = require("fs");

router.get("/obtener_soportesxreg_indicador/:id", authMiddleware, (req, res) => {
    //select a.id_registroindicador, a.vigencia, e.nombre_mes, b.id_indicador, b.nombre_indicador, u.num_identificacion, concat(u.nombre, ' ', u.apellido) as nombre_profesional from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (u.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) where a.vigencia = $1 and e.id_mes = $2 and d.id_area = $3 order by a.id_registroindicador
    //console.log(req.query)
    modelControlMando.consultar_soportes_x_regIndicador(req.params.id).then(lista_soportes => {
        //console.log(lista_soportes);

        res.render(config.rutaPartials +"soporte/list", {layout:false, lista_soportes: lista_soportes, id_reg_indicador: req.params.id });
    });


});

///descargar-recurso-soporte/

router.get("/descargar-recurso/:id_soporte", authMiddleware, (req, res) => {
    //select a.id_registroindicador, a.vigencia, e.nombre_mes, b.id_indicador, b.nombre_indicador, u.num_identificacion, concat(u.nombre, ' ', u.apellido) as nombre_profesional from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (u.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) where a.vigencia = $1 and e.id_mes = $2 and d.id_area = $3 order by a.id_registroindicador
    //console.log(req.query)
    const spawn = require('child_process').spawn;


    modelControlMando.consultar_soporte(req.params.id_soporte).then(lista_soportes => {
        //console.log("de " + lista_soportes[0].ruta_digital +" a "+path.join(config.rutaSoportes_tmp_Ctm));

        var file = fs.readFileSync(path.join(config.rutaSoportesCtm, lista_soportes[0].nombre_soporte), 'binary');

        res.setHeader('Content-disposition', 'attachment; filename=' + lista_soportes[0].nombre_soporte);
        res.setHeader('Content-Type', lista_soportes[0].mime_type);

        res.write(file, 'binary');
        res.end();
        
        //const spawn_cp = spawn('cmd.exe', ['/c', "C://test.bat"], { shell: true }, { stdio: 'inherit' });
        //const spawn_cp = spawn('cmd.exe', ['/c', "C://bat_copy.bat", lista_soportes[0].ruta_digital, path.join(config.rutaSoportes_tmp_Ctm)]);

        /*spawn_cp.stdout.on('data', (data) => {
            console.log("std OUT");
            console.log(data.toString())

        });
        spawn_cp.stderr.on('data', (data) => {
                console.log("std ERR");
                console.error(data.toString());
            })
            //res.send(stdout);

        spawn_cp.on('close', (code) => {
            console.log('OK.. code: ' + code);
            var preText = `Child exited with code ${code} : `;
            switch (code) {
                case 1:
                    console.info(preText + "El comando BATCH se ejecuto correctamente...");

                    console.log(lista_soportes);
                    var file = fs.readFileSync(path.join(config.rutaSoportesCtm, lista_soportes[0].nombre_soporte), 'binary');

                    //res.download(path.join(__dirname, "/filesBipsUploads/", lista_soportes[0].nombre_soporte));
                    //res.setHeader('Content-Length', 10000000000000000);
                    res.setHeader('Content-disposition', 'attachment; filename=' + lista_soportes[0].nombre_soporte);
                    res.setHeader('Content-Type', lista_soportes[0].mime_type);

                    res.write(file, 'binary');
                    res.end();


                    break;
                case 2:
                    console.info(preText + "The file already exists");
                    break;
                case 3:
                    console.info(preText + "The file doesn't exists and now is created");
                    break;
                case 4:
                    console.info(preText + "An error ocurred while creating the file");
                    break;
            }
        });;*/


    });


});


router.delete("/eliminar-recurso-soporte/:id_soporte", authMiddleware, (req, res) => {

    const spawn = require('child_process').spawn;
    modelControlMando.consultar_soporte(req.params.id_soporte).then(lista_soportes => {

        modelControlMando.eliminar_soporte_x_idSoporte(req.params.id_soporte).then(rspta_eliminacion => {



            msg = 'El Soporte ' + lista_soportes[0].nombre_original + ' se eliminó correctamente...';
            if (rspta_eliminacion['command'] == "DELETE" && rspta_eliminacion['rowCount'] > 0) {

                console.log("respuesta de eliminacion: 1, Se elimino correctamente el soporte...");
                msg = 'El Soporte ' + lista_soportes[0].nombre_original + ' se eliminó correctamente...';


                //se elimina el soporte (digital) del directorio                    
                const spawn_del = spawn('cmd.exe', ['/c', "C://task_delete_file.bat", config.rutaSoportesCtm, lista_soportes[0].nombre_soporte]);


                spawn_del.stdout.on('data', (data) => {
                    console.log("std OUT");
                    console.log(data.toString())

                });
                spawn_del.stderr.on('data', (data) => {
                        console.log("std ERR");
                        console.error(data.toString());
                    })
                    //res.send(stdout);

                spawn_del.on('close', (code) => {
                    console.log('OK.. code: ' + code);
                    var preText = `Child exited with code ${code} : `;
                    switch (code) {
                        case 1:
                            //req.flash('notify_del_soporte', msg);
                            res.status(200).send({ status: 200, msg: msg });
                            break;
                        case 2:
                            console.info(preText + "The file already exists");
                            break;
                        case 3:
                            console.info(preText + "The file doesn't exists and now is created");
                            break;
                        case 4:
                            console.info(preText + "An error ocurred while creating the file");
                            break;
                    }
                });;


            } else {
                console.log("respuesta de eliminacion: ERROR... 0, ocurrio un problema al eliminar el Soporte " + lista_soportes[0].nombre_original);
                msg = ' ocurrio un problema al eliminar el soporte... ' + lista_soportes[0].nombre_original;
                //req.flash('notify_del_soporte', msg);
                res.status(300).send({ status: 300, msg: msg });

            }







        })






    });


});


router.delete("/eliminar-recurso-temporal/:tipo/:nombre_archivo", authMiddleware, (req, res) => {

    const spawn = require('child_process').spawn;
    var spawn_del = '';

    msg = 'El Soporte temp  ' + req.params.nombre_archivo + ' se eliminó correctamente...';

    console.log("respuesta de eliminacion: 1, Se elimino correctamente el soporte temp despues de descargar ...");
    msg = 'El Soporte temp' + req.params.nombre_archivo + ' se eliminó correctamente despues de descargar...';


    //se elimina el soporte (digital) del directorio 
    //tipo 1 = DESCARGA
    //tipo 2 = VISUALIZACION                   
    if (req.params.tipo = 1) {
        console.log('el archivo es accion tipo 1= DESCARGAR')
        spawn_del = spawn('cmd.exe', ['/c', "C://task_delete_file.bat", config.rutaSoportes_tmp_Ctm , req.params.nombre_archivo]);
    } else if (req.params.tipo = 2) {
        console.log('el archivo es accion tipo 2= VISUALIZACION')
        spawn_del = spawn('cmd.exe', ['/c', "C://task_delete_file.bat", config.rutaPublicPdfjs, req.params.nombre_archivo]);
    }



    spawn_del.stdout.on('data', (data) => {
        console.log("std OUT");
        console.log(data.toString())

    });
    spawn_del.stderr.on('data', (data) => {
            console.log("std ERR");
            console.error(data.toString());
        })
        //res.send(stdout);

    spawn_del.on('close', (code) => {
        console.log('OK.. code: ' + code);
        var preText = `Child exited with code ${code} : `;
        switch (code) {
            case 1:
                //req.flash('notify_del_soporte', msg);
                res.send({ status: 200, msg: msg });
                break;
            case 2:
                console.info(preText + "The file already exists");
                break;
            case 3:
                console.info(preText + "The file doesn't exists and now is created");
                break;
            case 4:
                console.info(preText + "An error ocurred while creating the file");
                break;
        }
    });;





});

module.exports = router;