const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const config = require("../config/config");
const authMiddleware = require("../middlewares/auth");
// Declaracion de variables para los modelos
const modelplanos = require("../models/archivosPlanosModel");
const modelbips = require("../models/modelModel");
const modelvalidaciones = require("../models/validacionModel");
const exportErrorsToExcel = require('./exportService');

const storage = multer.diskStorage({
    destination: config.rutaFile + "/",
    // Req ->info peticion, file ->archivo que se sube, cb ->funcion finalizacion

    filename: function(req, file, cb) {
        var numcarga = req.files.length;

        modelplanos.cantidad_RegistrosPlanos_tmp().then((rescount) => {
            var ext = path.extname(file.originalname);

            var numplanos = Number(Object.values(rescount[0]));
            numplanos = numplanos + numcarga;

            modelplanos.consultar_RegistrosPlanos_tmp().then((rsta) => {
                if (rsta == "") {
                    if (ext !== ".txt" && ext !== ".Txt") {
                        return cb("Solo se permite Archivos Formato .txt");
                    } else if (numplanos > 10) {
                        return cb("Solo se permite Maximo 10 Archivos planos");
                    } else {
                        let fech_now = Date.now();

                        let date_ = new Date(fech_now);

                        let fecha_completa =
                            date_.getDate() +
                            "" +
                            (date_.getMonth() + 1) +
                            "" +
                            date_.getFullYear();

                        cb(
                            "",
                            "_" + fecha_completa + "_" + file.originalname
                        );
                    }
                } else {
                    rsta.forEach((plano) => {
                        if (plano["nombre_original"] == file.originalname) {
                            return cb(
                                "Error: Archivo " + file.originalname + " esta cargado"
                            );
                        }

                        if (numcarga > 10) {
                            return cb("Solo se permite Maximo 10 Archivos planos");
                        } else if (ext !== ".txt" && ext !== ".Txt") {
                            return cb("Solo se permite Archivos Formato .txt");
                        } else if (numplanos > 10) {
                            return cb("Solo se permite Maximo 10 Archivos planos");
                        } else {
                            let fech_now = Date.now();

                            let date_ = new Date(fech_now);

                            let fecha_completa =
                                date_.getDate() +
                                "" +
                                (date_.getMonth() + 1) +
                                "" +
                                date_.getFullYear();
                            cb(
                                "",
                                "_" + fecha_completa + "_" + file.originalname
                            );
                        }
                    });
                }
            });
        });
    },
});

const upload = multer({
    storage: storage,
});

router.get("/cargar-plano", authMiddleware, function(req, res) {
    modelbips
        .obtenerIps()
        .then((listaIps) => {
            res.render(config.rutaPaginas + "formularioCarga", {
                listaIps: listaIps,
                user: req.session.user,
                area: req.session.username["nombre_area"],
            });
        })
        .catch((err) => {
            return res.status(500).send("Error obteniendo registros");
        });
});

router.get("/listado-archivos", authMiddleware, (req, res) => {
    var bandera_panel_envio = false;
    var habilitar_carga_bandera = false;
    var habilitar_eliminar_all = true;
    var bandera_btn_enviar = false;

    modelplanos.ObtenerPlanos_validos().then((planos_val) => {
        modelplanos.validarPlanosNecesarios(planos_val).then((rsta) => {
            if (rsta == 1) {
                bandera_panel_envio = true;

                modelplanos.consultar_RegistrosPlanos_tmp().then((planos_all) => {
                    modelplanos
                        .contar_Planos_Validados()
                        .then((conteo_planos) => {
                            if (conteo_planos[0]["total_validados"] >= 10) {
                                bandera_btn_enviar = false;
                                habilitar_carga_bandera = true;
                                habilitar_eliminar_all = false;

                                modelplanos
                                    .validarPlanosCargados(planos_all)
                                    .then((rsta_cargados) => {
                                        if (rsta_cargados == 0) {
                                            habilitar_carga_bandera = false;

                                            bandera_btn_enviar = true;

                                            habilitar_eliminar_all = false;

                                            res.setHeader("Content-type", "text/html");
                                            res.render(
                                                config.rutaPartials + "cargaPlano/listaPlano", {
                                                    layout: false,
                                                    arr_files: planos_all,
                                                    habilitar_envio_la: bandera_panel_envio,
                                                    habilitar_carga: habilitar_carga_bandera,
                                                    habilitar_eliminar: habilitar_eliminar_all,
                                                    habilitar_btn_envio: bandera_btn_enviar,
                                                }
                                            );
                                        } else {
                                            modelplanos
                                                .consultar_RegistrosPlanos_tmp()
                                                .then((listaArchivos) => {
                                                    res.render(
                                                        config.rutaPartials + "cargaPlano/listaPlano", {
                                                            layout: false,
                                                            arr_files: listaArchivos,
                                                            habilitar_envio_la: bandera_panel_envio,
                                                            habilitar_carga: habilitar_carga_bandera,
                                                            habilitar_eliminar: habilitar_eliminar_all,
                                                            habilitar_btn_envio: bandera_btn_enviar,
                                                        }
                                                    );
                                                });
                                        }
                                    });
                            } else {
                                bandera_panel_envio = false;

                                res.setHeader("Content-type", "text/html");
                                res.render(config.rutaPartials + "cargaPlano/listaPlano", {
                                    layout: false,
                                    arr_files: planos_all,
                                    habilitar_envio_la: bandera_panel_envio,
                                    habilitar_carga: habilitar_carga_bandera,
                                    habilitar_eliminar: habilitar_eliminar_all,
                                    habilitar_btn_envio: bandera_btn_enviar,
                                });
                            }
                        })
                        .catch((err) => {
                            return res.status(500).send("Error obteniendo registros");
                        });
                });
            } else {
                modelplanos.consultar_RegistrosPlanos_tmp().then((listaArchivos) => {
                    res.render(config.rutaPartials + "cargaPlano/listaPlano", {
                        layout: false,
                        arr_files: listaArchivos,
                        habilitar_envio_la: bandera_panel_envio,
                        habilitar_carga: habilitar_carga_bandera,
                        habilitar_eliminar: habilitar_eliminar_all,
                        habilitar_btn_envio: bandera_btn_enviar,
                    });
                });
            }
        });
    });
});

router.delete(
    "/file/delete/:name/archivo-bips",
    authMiddleware,
    function(req, res) {
        let name = req.params.name;

        fs.unlink(
            path.join(config.rutaFile + "/" + name),
            (err) => {
                if (err) {
                    console.log(
                        "No se pudo borrar el archivo,posiblemente este ya NO existe, por favor contacte con el administrador"
                    );
                }
                var array_nombre = name.split("_");
                modelplanos
                    .eliminar_RegistrosPlanos_tmp(req.query.id_ips, name)
                    .then((respuesta) => {
                        if (respuesta["command"] == "DELETE" && respuesta["rowCount"] > 0) {
                            modelplanos
                                .consultar_RegistrosPlanos_tmp()
                                .then((listaArchivos) => {
                                    return res
                                        .status(200)
                                        .send(
                                            "El archivo plano " +
                                            array_nombre[2] +
                                            " se eliminó correctamente..."
                                        );
                                })
                                .catch((err) => {
                                    return res.status(500).send("No se elimino");
                                });
                        } else {
                            return res.status(500).send("No se elimino");
                        }
                    });
            }
        );
    }
);

router.post(
    "/files",
    authMiddleware,
    upload.array("files"),
    (req, res, err) => {
        let periodo = req.body.txtfecha_inicial + " - " + req.body.txtfecha_final;

        let fechNow = Date.now();

        let date_ = new Date(fechNow);

        let fecha_completa =
            date_.getDate() +
            "/" +
            (date_.getMonth() + 1) +
            "/" +
            date_.getFullYear();
        let fecha_completa_sinSeparador =
            date_.getDate() +
            "" +
            (date_.getMonth() + 1) +
            "" +
            date_.getFullYear() +
            "_";
        let hora =
            date_.getHours() + ":" + date_.getMinutes() + ":" + date_.getSeconds();

        let fecha_hora = fecha_completa + " " + hora;

        for (var i in req.files) {
            let path_ins = path.join(
                config.rutaFile +
                "/" +
                "_" +
                fecha_completa_sinSeparador +
                req.files[i].originalname
            );
            let nombre_temp =
                "_" +
                fecha_completa_sinSeparador +
                req.files[i].originalname;

            try {
                modelplanos
                    .insertar_RegistrosPlanos_tmp(
                        req.body.cbxips,
                        req.body.nombre_ips,
                        periodo,
                        req.files[i].originalname,
                        req.files[i].mimetype,
                        fecha_hora,
                        "0",
                        nombre_temp,
                        path_ins
                    )
                    .then((respuesta) => {

                        if (respuesta["command"] == "INSERT" && respuesta["rowCount"] > 0) {
                            return res.send("La operación se ejecuto con exito..");
                        } else {
                            return res.send("Error guardar los archivos Bd");
                        }
                    });
            } catch (error) {
                return res.send("Error guardar los archivos");
            }
        }
    }
);

router.get(
    "/validar-registros-ap/:ips",
    authMiddleware,
    async function(req, res, next) {
        modelbips
            .validarRegistrosAP(
                req.params.ips,
                req.query.fecha_inicial,
                req.query.fecha_fin
            )
            .then((validaregistros) => {
                const respuesta = validaregistros.rows[0].total_reg;
                return res.send(respuesta);
            });
    }
);

router.post(
    "/file/validar/:name/archivo-bips",
    authMiddleware,
    function(req, res) {
        let name_tmp = req.params.name;
        var array_nombre = name_tmp.split("_");
        let nombre_txt = array_nombre[2];

        var nombre_plano = nombre_txt.slice(0, 2);
        var habilita_eliminar_todos = false;

        modelplanos.contar_Planos_Validados().then((cont_planos_val) => {
            if (cont_planos_val.total_validados >= 1) {
                habilita_eliminar_todos = true;
            }
        });

        modelvalidaciones
            .validarPlano(name_tmp, nombre_plano)
            .then((rsta_validacion) => {
                //si la respuesta de validacion del plano, retorna la respuesta vacia ""
                //significa que el plano se valido CORRECTAMENTE.
                if (rsta_validacion == "") {
                    modelplanos
                        .validar_RegistrosPlanos_tmp(req.query.id_ips, name_tmp)
                        .then((respuesta) => {
                            if (
                                respuesta["command"] == "UPDATE" &&
                                respuesta["rowCount"] > 0
                            ) {
                                //Aqui se valida por cada iteracion de validacion de planos si todos se encuentran validados,
                                //esto con el fin de habilitar el boton de envio de los planos ya validados, tener en cuenta los planos
                                //que son necesarios AP, AC, AT, AH, AU , AF

                                modelplanos.ObtenerPlanos_validos().then((planos_val) => {
                                    modelplanos
                                        .validarPlanosNecesarios(planos_val)
                                        .then((rsta) => {
                                            //Si la validacion de los planos necesarios resulta con exito "1" -> rsta = 1, el sistema debera habilitar el boton de
                                            //envio para el trabajo, habilitar_envio: true

                                            if (rsta == 1) {
                                                //despues de realizar la validacion del plano y la carga con su transformacion, se debera responder a la vista
                                                //validando que la transformacion se ha ejecutado con EXITO cod_estado = o
                                                //return res.send("El archivo plano " + nombre_plano + " fue validado correctamente!");
                                                /*
                                                req.flash(
                                                  "notify",
                                                  "El Archivo Plano " +
                                                    nombre_plano +
                                                    " fue validado correctamente..."
                                                );*/
                                                res.json({
                                                    respuesta: "OK",
                                                    status: 200,
                                                    habilitar_envio: true,
                                                    habilitar_elim_all: habilita_eliminar_todos,
                                                    msg: "El plano " +
                                                        nombre_plano +
                                                        " fue validado correctamente...",
                                                });
                                                // } else {
                                                // console.error("Ocurrio un problema con la ejecucion del comando/tranformacion_ rspta de retorno: ");
                                                //}
                                            } else {
                                                //despues de realizar la validacion del plano y la carga con su transformacion, se debera responder a la vista
                                                //validando que la transformacion se ha ejecutado con EXITO
                                                //Se debe validar la respuesta
                                                //return res.send("El archivo plano " + nombre_plano + " fue validado correctamente!");


                                                /* req.flash(
                                                   "notify",
                                                   "El Archivo Plano " +
                                                     nombre_plano +
                                                     " fue validado correctamente..."
                                                 );*/
                                                res.json({
                                                    respuesta: "OK",
                                                    status: 200,
                                                    habilitar_envio: false,
                                                    habilitar_elim_all: habilita_eliminar_todos,
                                                    msg: "El plano " +
                                                        nombre_plano +
                                                        " fue validado correctamente...",
                                                });
                                                // }else {
                                                //console.error("Ocurrio un problema con la ejecucion del comando/tranformacion_ rspta de retorno: " );
                                                //}
                                            }
                                        });
                                });
                            } else {
                                //return res.send("El Archivo Plano " + nombre_plano + "No se logro actualizar en BD, error actualizando, PLANO NO VALIDADO");

                                /*req.flash(
                                  "error",
                                  "El Archivo Plano " +
                                    nombre_plano +
                                    "No se logro actualizar en BD, error actualizando, validado NO"
                                );*/
                                res.json({
                                    error: 500,
                                    msg: "El Archivo Plano " + nombre_plano + "No se logro actualizar en BD, error actualizando, PLANO NO VALIDADO"
                                });
                            }
                        })
                        .catch((err) => {
                            return res.status(500).send("Error obteniendo registros");
                        });
                } else {
                    //si la respuesta de validacion NO esta vacia, se retornan los errores encontrados
                    console.log("Número de errores encontrados en el plano: " + rsta_validacion.length);
                    res.json({
                        status: 500,
                        respuesta: rsta_validacion,
                        msg: "Error! el plano " + nombre_plano + " contiene errores en su estructura, por favor valide la lista de errores",
                    });
                    //return res.status(200).send(rsta_validacion);
                    /*return res.render(config.rutaPartials + 'cargaPlano/tabla-errores', {
                        rsta_validacion: rsta_validacion,
                        nombre_plano: nombre_plano,
                        user: req.session.user,
                        area: req.session.username["nombre_area"],
                    });*/
                    /* req.flash(
                       "error",
                       "El Archivo Plano " +
                         nombre_plano +
                         " tiene los siguientes errores:" +
                         rsta_validacion
                     );
                     res.json({
                       error: 500,
                       respuesta:
                         "El Archivo Plano " +
                         nombre_plano +
                         " tiene los siguientes errores:" +
                         rsta_validacion,
                     });*/
                }
            });
    }
);


router.delete("/delete-all/archivo-bips", authMiddleware, (req, res) => {
    // Método para eliminar todos los archivos planos cargados
    fs.readdir(config.rutaFile, (err, files) => {
        if (err) {
            res.json({ resultado: err });
        } else if (files.length == 0) {
            res.json({ resultado: "DATA_NOT_FOUND", msg: "No hay planos para eliminar. !!" });
        } else {
            files.forEach((file) => {
                try {
                    var ruta = path.join(config.rutaFile, "/", file);
                    fs.unlinkSync(ruta);
                } catch (error) {
                    console.error("Something wrong hrouterened removing the file", error);
                }
            });

            modelplanos
                .eliminar_all_RegistrosPlanos_tmp()
                .then((respuesta) => {
                    if (respuesta["command"] == "DELETE" && respuesta["rowCount"] > 0) {
                        console.log("Eliminacion de todos los planos OK...");
                    }
                })
                .catch((err) => {
                    console.log(err);
                });

            //req.flash("notify", "Los archivos fueron eliminados correctamente..");
            res.json({ resultado: "OK", status: 200, msg: "Los archivos fueron eliminados correctamente.." });
        }
    });
});

router.get("/generar-xlsx-err/:nombre_plano/archivo-bips", authMiddleware, (req, res) => {

    const workSheetColumnName = [
        "#",
        "Descripción",
    ];

    //console.log(req.params);
    //console.log(req.body);
    //console.log(req.query);
    /*const workSheetColumnName = [
        "ID",
        "Name",
        "Age"
    ];*/

    var workSheetName = 'xlsx_errores_plano_' + req.params.nombre_plano;
    //var filePath = './outputFiles/excel-from-js.xlsx';
    var filePath = path.join(config.rutaFile + '/xlsx_errores_plano_' + req.params.nombre_plano + '.xlsx');

    exportErrorsToExcel(req.query.err, workSheetColumnName, workSheetName, filePath);

    res.send("ok");

});

router.get("/descargar-xlsx-errores/:nombre/descarga-errores-xlsx", authMiddleware, (req, res) => {

    var file = fs.readFileSync(
        path.join(
            config.rutaFile +
            "/xlsx_errores_plano_" + req.params.nombre + '.xlsx'

        ),
        "binary"
    );

    //res.download(path.join(__dirname, "/filesBipsUploads/", lista_soportes[0].nombre_soporte));
    //res.setHeader('Content-Length', 10000000000000000);
    res.setHeader(
        "Content-disposition",
        "attachment; filename=" + "xlsx_errores_plano_" + req.params.nombre + '.xlsx'
    );
    res.setHeader("Content-Type", 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    res.write(file, "binary");
    res.end();

});

router.get("/validacion-carga-envio", authMiddleware, (req, res) => {

    // validacion de planos SI todos se encuentran validados,
    //esto con el fin de habilitar el boton de envio de los planos ya validados, tener en cuenta los planos
    //que son necesarios TODOS
    var habilita_eliminar_todos = false;

    modelplanos.contar_Planos_Validados().then((cont_planos_val) => {
        if (cont_planos_val.total_validados >= 1) {
            habilita_eliminar_todos = true;

        }

        modelplanos.ObtenerPlanos_validos().then((planos_val) => {
            /*
            validacion de los planos necesarios, si alguno NO esta validado se evalua en la sig condicion:

            Si la validacion de los planos necesarios resulta con exito "1" -> rsta = 1, el sistema debera habilitar el boton de
            envio para el trabajo, habilitar_envio: true
            
            */
            //console.log(planos_val);
            //console.log(planos_val.length);


            modelplanos.validarPlanosNecesarios(planos_val)
                .then((rsta) => {
                    //console.log(rsta);
                    if (rsta == 1) {

                        res.json({
                            respuesta: "OK",
                            status: 200,
                            habilitar_envio: true,
                            habilitar_elim_all: habilita_eliminar_todos,
                        });
                    } else {

                        res.json({
                            respuesta: "OK",
                            status: 200,
                            habilitar_envio: false,
                            habilitar_elim_all: habilita_eliminar_todos,
                        });

                    }

                })
        });
    });




});

module.exports = router;