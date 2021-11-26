const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");
const modelControlMando = require("../models/controlMandoModel");
const path = require("path");
const fs = require("fs");

router.get("/obtener_soportesxreg_indicador/:id", authMiddleware, (req, res) => {
    //select a.id_registroindicador, a.vigencia, e.nombre_mes, b.id_indicador, b.nombre_indicador, u.num_identificacion, concat(u.nombre, ' ', u.apellido) as nombre_profesional from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (u.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) where a.vigencia = $1 and e.id_mes = $2 and d.id_area = $3 order by a.id_registroindicador
    console.log(req.query)
    modelControlMando.consultar_soportes_x_regIndicador(req.params.id).then(lista_soportes => {
        console.log(lista_soportes);

        res.render(config.rutaPartials +"soporte/list", {layout:false, lista_soportes: lista_soportes });
    });


});

///descargar-recurso-soporte/

router.get("/descargar-recurso/:id_soporte", authMiddleware, (req, res) => {
    //select a.id_registroindicador, a.vigencia, e.nombre_mes, b.id_indicador, b.nombre_indicador, u.num_identificacion, concat(u.nombre, ' ', u.apellido) as nombre_profesional from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (u.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) where a.vigencia = $1 and e.id_mes = $2 and d.id_area = $3 order by a.id_registroindicador
    //console.log(req.query)
    const spawn = require('child_process').spawn;


    modelControlMando.consultar_soporte(req.params.id_soporte).then(lista_soportes => {
        console.log("" + lista_soportes[0].ruta_digital);
        //const spawn_cp = spawn('cmd.exe', ['/c', "C://test.bat"], { shell: true }, { stdio: 'inherit' });
        const spawn_cp = spawn('cmd.exe', ['/c', "C://bat_copy.bat", lista_soportes[0].ruta_digital, config.rutaSoportesCtm]);

        spawn_cp.stdout.on('data', (data) => {
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
        });;


    });


});

module.exports = router;