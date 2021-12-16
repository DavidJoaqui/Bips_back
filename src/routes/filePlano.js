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
const controlMandoModel = require("../models/controlMandoModel");

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
    var bandera_cargados= false;

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
                                            bandera_cargados = false;

                                            res.setHeader("Content-type", "text/html");
                                            res.render(
                                                config.rutaPartials + "cargaPlano/listaPlano", {
                                                    layout: false,
                                                    arr_files: planos_all,
                                                    habilitar_envio_la: bandera_panel_envio,
                                                    habilitar_carga: habilitar_carga_bandera,
                                                    habilitar_eliminar: habilitar_eliminar_all,
                                                    habilitar_btn_envio: bandera_btn_enviar,
                                                    habilitar_bandera_cargados:bandera_cargados,
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

router.delete("/file/delete/:name/archivo-bips",
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

router.post("/files",
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

router.get("/validar-registros-ap/:ips",
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

router.post("/file/validar/:name/archivo-bips",
    authMiddleware,
    function(req, res) {
        let name_tmp = req.params.name;
        var array_nombre = name_tmp.split("_");
        let nombre_txt = array_nombre[2];
        let array_nombre_org_sin_ext = nombre_txt.split(".");
        let nombre_org_sin_ext = array_nombre_org_sin_ext[0];
        console.log(nombre_org_sin_ext);
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

                    var urlFile_error_plano = '/descargar-xlsx-errores/'+nombre_org_sin_ext+"/descarga-errores-xlsx"

                    modelplanos.actualizarErrorRegistroPlanoTmp(req.query.id_ips, name_tmp,urlFile_error_plano).then(resultado_act => {


                    });

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


router.delete("/delete-all/archivo-bips/:tipo", authMiddleware, (req, res) => {
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

                        

                        if(req.params.tipo == "delete_archivos"){
                          res.json({ resultado: "OK", status: 200, msg: "Los archivos fueron eliminados correctamente.." });

                        }else if(req.params.tipo == "delete_trabajo"){
                            res.json({ resultado: "OK", status: 200 });
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });

            //req.flash("notify", "Los archivos fueron eliminados correctamente..");
            
        }
    });
});

router.get("/generar-xlsx-err/:nombre_plano/archivo-bips", authMiddleware, (req, res) => {

    const workSheetColumnName = [
        "#",
        "Descripción",
    ];
    
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
    var habilita_eliminar_todos = true;

    modelplanos.contar_Planos_Validados().then((cont_planos_val) => {
        if (cont_planos_val.total_validados >= 1) {
            habilita_eliminar_todos = false;

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

                    modelplanos.validarPlanosCargados(planos_val)
                .then((rsta_cargados) => {

                    if (rsta  == 0) {
                                                
                        res.json({
                            respuesta: "OK",
                            status: 200,
                            habilitar_envio: false,
                            habilitar_elim_all: true,
                            habilitar_carga: false,
                        });                                                                       

                }

                    if (rsta == 1 && rsta_cargados == 0) {
                                                
                            res.json({
                                respuesta: "OK",
                                status: 200,
                                habilitar_envio: true,
                                habilitar_elim_all: false,
                                habilitar_carga: false,
                            });                                                                       

                    }else{
                        
                        res.json({
                            respuesta: "OK",
                            status: 200,
                            habilitar_envio: false,
                            habilitar_elim_all: true,
                            habilitar_carga: true,
                        });
                    }

                    
                });
                    //console.log(rsta);
                    

                })
        });
    });




});

router.post("/enviar-carga/ejecucion-multiple/archivo-bips", authMiddleware, (req, res) => {

    //llamado de la transformacion que envia los datos de los archivos planos tmp a las tablas de los planos
    //modelktr.selecionaKtr(name_tmp,nombre_plano);
    //buscar en bd el plano que llega como parametro y obtener el path del plano para pasar a la transformacion,
    //se debe verficar que el plano este validado



    //buscar en bd el plano que llega como parametro y obtener el path del plano para pasar a la transformacion,
    //se debe verficar que el plano este validado
    var path_plano_AF = "";
    var path_plano_AN = "";
    var path_plano_AM = "";
    var path_plano_AT = "";
    var path_plano_AC = "";
    var path_plano_AU = "";
    var path_plano_US = "";
    var path_plano_AH = "";
    var path_plano_CT = "";
    var path_plano_AP = "";

    var cont = 0;

    var spawn = require('child_process').spawn;

    modelplanos.ObtenerPlanos_validos().then(rsta => {
        //console.log(rsta);        
        //var num_planos = rsta.length;
        //console.log("numero incial de planos validados: " + num_planos);
        rsta.forEach(plano => {


            if (plano['validado'] == true) {

                //var path_plano = plano['path_plano'];
                //modelktr.selecionaKtr(plano['nombre_original'].slice(0, 2)).then(nombre_ruta => {
                // console.log(rsta_seleccionKtr);
                //console.log(path_plano);

                if (plano["nombre_original"].slice(0, 2) == "AF") {
                    path_plano_AF = plano["path_plano"];
                    cont++;
                } else if (plano["nombre_original"].slice(0, 2) == "AP") {
                    path_plano_AP = plano["path_plano"];
                    cont++;
                } else if (plano["nombre_original"].slice(0, 2) == "AC") {
                    path_plano_AC = plano["path_plano"];
                    cont++;
                } else if (plano["nombre_original"].slice(0, 2) == "AT") {
                    path_plano_AT = plano["path_plano"];
                    cont++;
                } else if (plano["nombre_original"].slice(0, 2) == "AH") {
                    path_plano_AH = plano["path_plano"];
                    cont++;
                } else if (plano["nombre_original"].slice(0, 2) == "CT") {
                    path_plano_CT = plano["path_plano"];
                    cont++;
                } else if (plano["nombre_original"].slice(0, 2) == "US") {
                    path_plano_US = plano["path_plano"];
                    cont++;
                } else if (plano["nombre_original"].slice(0, 2) == "AM") {
                    path_plano_AM = plano["path_plano"];
                    cont++;
                } else if (plano["nombre_original"].slice(0, 2) == "AN") {
                    path_plano_AN = plano["path_plano"];
                    cont++;
                } else if (plano["nombre_original"].slice(0, 2) == "AU") {
                    path_plano_AU = plano["path_plano"];
                    cont++;
                }

            } else {
                console.log("----------------------------------------------------------------------------------------------------");
                console.log("Se omite la ejecucion del comando/transformacion para el archivo: " + plano['nombre_original'] + " NO se encuentra validado...");
                console.log("----------------------------------------------------------------------------------------------------");
                return 1;
            }

        });



        if (cont == 10) {
            //var prueba_3 = spawn('cd /var/lib/data-integration/; sh pan.sh -file="/archivos_bips/Trans_Archivos_Planos/Trans_archivosPlanos.ktr" -level=Error >> /archivos_bips/trans.log;', {encoding: 'utf8', stdio: 'ignore'});
            //const spawn_trs = spawn('sh pan.sh',['-file="/archivos_bips/Trans_Archivos_Planos/Trans_archivosPlanos.ktr']);
            //console.log(__dirname);.
            //console.log(rsta[0]['validado']);
            //console.log(rsta[0]['path_plano']);
            //var str=JSON.stringify(rsta,['path_plano']);
            //console.log(str);
            //console.log(Object.entries(str));

            //console.log(`value=${path_plano}`);

            //console.log(path);


            //console.log(JSON.stringify(rsta));
            //console.log(JSON.parse(JSON.stringify(rsta)));
            //console.log(JSON.stringify(rsta,['path_plano']));
            console.log(path_plano_CT);
            console.log("===========================================================================");
            console.log("================Inicia ejecucion de la transformacion      =================");
            console.log("fecha/hora de inicio de la ejecucion : ");
            var now = new Date();
            console.log(now.toUTCString());
            //obtener_fecha_hora().then(rt=>{
            //  console.log(rt);

            //            });
            console.log("===========================================================================");


            /*
                            La función spawn lanza un comando en un nuevo proceso y podemos usarlo para pasarle cualquier argumento a ese comando
            
                            */
            //let spawn_trs = spawn('sh', ['/var/lib/data-integration/pan.sh', "-file=src/IntegracionKtr/" + nombre_transformacion, '-level=Basic', "-param:ruta_archivo_af=" + path_plano_AF, '-logfile=/tmp/trans.log']);
            
            //carga archivo plano ct funcionando
            /**
            var ruta_archivo='"/param:ruta_archivo=E:/Dato_BI/temp/CT000940.Txt" ';
            var spawn_trs = spawn('cmd.exe', ['/c', "C:/Users/SOPORTE_FACTURACION/Downloads/data-integration/pan.bat /file=E:/Dato_BI/Bips_back/src/IntegracionKtr/tras-CT.ktr "+ruta_archivo+" /level=Detailed >> E:/Dato_BI/temp/trans.log"], {
                windowsVerbatimArguments: true
              }); 
              
            */    

              var param_ct =  "/param:ruta_archivo_ct="+path_plano_CT;
              var param_af =  "/param:ruta_archivo_af="+path_plano_AF;
              var param_an =  "/param:ruta_archivo_an="+path_plano_AN;
              var param_am =  "/param:ruta_archivo_am="+path_plano_AM;
              var param_at =  "/param:ruta_archivo_at="+path_plano_AT;  
              var param_ac =  "/param:ruta_archivo_ac="+path_plano_AC;  
              var param_au =  "/param:ruta_archivo_au="+path_plano_AU;
              var param_us =  "/param:ruta_archivo_us="+path_plano_US;
              var param_ah =  "/param:ruta_archivo_ah="+path_plano_AH;
              var param_ap =  "/param:ruta_archivo_ap="+path_plano_AP;  

            //var aux ='"/param:ruta_archivo=E:/Dato_BI/Bips_back/filesBipsUploads/_9122021_CT000940.Txt" ';
                                            
            var spawn_trs = spawn('cmd.exe', ['/c', "F:/data-integration/pan.bat /file=E:/Dato_BI/Bips_back/src/IntegracionKtr/tras-all-Planos.ktr "+'"'+param_ct+'" "'+param_af+'" "'+param_an+'" "'+param_am+'" "'+param_at+'" "'+param_ac+'" "'+param_au+'" "'+param_us+'" "'+param_ah+'" "'+param_ap+'"'+" /level=Detailed >> E:/Dato_BI/temp/trans.log"], {
                windowsVerbatimArguments: true
              });
            // F:/data-integration/pan.bat     C:/Users/SOPORTE_FACTURACION/Downloads/data-integration/pan.bat

            console.log(spawn_trs);
            
         
            spawn_trs.stdout.pipe(process.stdout);

            spawn_trs.stdout.setEncoding('utf8');

            spawn_trs.stderr.setEncoding('utf8');

            //Con los flujos legibles, podemos escuchar el evento de datos, que tendrá la 
            //salida del comando o cualquier error encontrado al ejecutar el comando
            spawn_trs.stdout.on('data', data => {
                console.log(`stdout:\n${data}`)
            });
            spawn_trs.stderr.on('data', (data) => {
                // console.error(`stderr: ${data}`);
            });



            spawn_trs.on('close', (code) => {

                console.log("===========================================================================");
                console.log("================   FIN ejecucion de la transformacion      =================");
                console.log("fecha/hora fin de la ejecucion: ");
                //console.log(obtener_fecha_hora());
                console.log(now.toUTCString());
                console.log("===========================================================================");
                console.log("resultado de la ejecucion: ");
                console.log(code)
                    //Se retorna el codigo de estado capturado por el buffer para validar si la transformacion se ejecuto con Exito
                    //OK : 0


                if (code == 0) {

                    console.log("El comando/transformacion se ejecuto con exito... estado: " + code);


                    modelplanos.actualizar_carga_temp().then(respuesta => {
                        if (respuesta['command'] == "UPDATE" && respuesta['rowCount'] > 0) {
                            // console.log("actualizo CARGA TEMP OK para el plano ... " + plano['nombre_original']);
                            console.log("actualizo CARGA TEMP OK para todos los planos ... ");
                            return res.status(200)
                                        .send(
                                            {msg:"Se realizo la carga de archivos correctamente...actualizados -> "+respuesta['rowCount']+ " registros"+ code, estado: 200 }
                                        );


                        }

                    });                                  
                } if(code == '1') {
                    console.error('Ocurrio un problema con la ejecucion del comando/transformacion ' + code);
                    //se retorna el codigo de estado de errro
                    //return 1;
                    return res.status(200).send({msg: "Ocurrio un problema al ejecutar la carga de los archivos, problema con la transformacion, COD_ERR " + code, estado: 500});                    

                }



            });

            spawn_trs.on('exit', (code) => {
                console.log(`exit child process exited with code ${code}`);
                //return code;
            });

        }

    });





});

router.post("/enviar-trabajo/ejecucion/archivo-bips", authMiddleware,(req, res) => {

    //RETORNA  O CUANDO TERMINA EL TRABAJO EXITOSO  

    //Se realiza el llamado de la funcion que permite ejecutar el trabajo con la herramienta kitchen de spoon
    //modelktr.ejecucionJob().then(rsta => console.log("La respuesta de ejecucion del trabajo es "+rsta));

    const path = require('path');
    const fs = require('fs');
    const spawn = require('child_process').spawn;

    console.log("===========================================================================");
    console.log("================Inicia ejecucion del job      =================");
    console.log("fecha/hora de inicio de la ejecucion : ");
    //modelktr.obtener_fecha_hora().then(fh => console.log(fh));
    console.log("===========================================================================");

    const spawn_job = spawn('cmd.exe', ['/c', ":/data-integration/pan.bat /file=E:/Dato_BI/Bips_back/src/integracionKjb/Job_reporte2193.kjb /level=Error >> E:/Dato_BI/temp/job.log"], {
        windowsVerbatimArguments: true
      });

      // F:/data-integration/pan.bat     C:/Users/SOPORTE_FACTURACION/Downloads/data-integration/pan.bat
    spawn_job.stdout.pipe(process.stdout);


    spawn_job.stdout.on('data', data => {
       //console.log(`stdout:\n${data}`)

        // res.send(data.toString());
    });
    spawn_job.stderr.on('data', (data) => {
        //console.error(`stderr: ${data}`);
    });
    //res.send(stdout);



    spawn_job.on('close', (code) => {



        console.log("CODE EJECUCION :" + code);

        //res.send(code);



        console.log("===========================================================================");
        console.log("================   FIN ejecucion del Job      =================");
        console.log("fecha/hora fin de la ejecucion: ");
        //modelktr.obtener_fecha_hora().then(fh => console.log(fh));
        console.log("===========================================================================");
        console.log("resultado de la ejecucion: ");

        console.log(`child process exited with code: ${code}`);

        if (code == '0') {
            //res.send(code);
            console.log("El comando/job se ejecuto con exito... estado: " + code);

            //res.status(200).send(code.toString());
            modelplanos.ObtenerPlanos_validos().then(rsta => {
                        
                    modelplanos.eliminar_all_RegistrosPlanos_tmp_validos().then(rsta_elim => {
                        if (rsta_elim['command'] == "DELETE" && rsta_elim['rowCount'] > 0) {
                           // console.log("respuesta de eliminacion: 1, todos los planos fueron eliminados en bd y proyecto");
                            //req.flash('notify', 'informacion fue cargada exitosamente...');
                            //res.json({ respuesta: "OK", status: 200, retorno: code.toString(), descripcion: ' ' });
                            return res.status(200).send({msg: "El trabajo se ejecuto con exito...", estado: 200});                    


                        }
                    });
                


            });





        } else {
           // res.status(200).send(code.toString());
            //console.error('Ocurrio un problema con la ejecucion del comando/job CODE:' + code);
            
            return res.status(200).send({msg: "Ocurrio un problema con la ejecución del comando/job CODE:" + code, estado: 500});                    

        }

    });


});



module.exports = router;