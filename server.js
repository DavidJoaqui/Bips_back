////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//----------------------------------Configuraciones e instancias de los modulos-------------------------------//
//                                                                                                            //
//                                              17/03/2021                                                    //
//                                                                                                            //          
//                                                                                                            //      
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const express = require('express');
const multer = require('multer');
const mimeTypes = require('mime-types');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
var moment = require('moment');
const flash = require('express-flash-messages')
const session = require('express-session')

const app = express();


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//----------------------------------  Configuraciones de Directorio              -----------------------------//
//                                                                                                            //
//                                              2021                                                          //
const dir_soportes_ctm = 'E:/Upload_Soportes_Bips/';
//                                                                                                            //      
////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//app.use(express.urlencoded);
//app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'filesBipsUploads')));
app.use(express.static(path.join(__dirname, 'pdf.js')));
app.use(express.static(path.join(__dirname, 'src/public')));
app.use(express.static(dir_soportes_ctm));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'src/vista'));
app.set("view engine", "ejs");
app.use(session({
    secret: '1d257a7cedc779675860fd92a7ca5baa3b14f7650bdff6612344a730d9a7082b8bfe5b63ab6b4c9aaa55aeb3acdd918a3d736cad21ac4c4e732d18afece369f20711205ee2485cb8ef819313000680c8',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 6000000,
    }

}))
app.use(flash());

//declaracion de variables para los modelos 
const modelplanos = require("./models/archivosPlanosModel");
const modelbips = require("./models/modelModel");
const modelvalidaciones = require("./models/validacionModel");
const modelktr = require("./models/ejecucion_KtrModel");
const modelSecurity = require("./models/loginModel");
const modelEntidad = require("./models/entidadesModel");
const modelControlMando = require("./models/controlMandoModel");




//var num_archivos = 11;

const storage = multer.diskStorage({



    destination: 'filesBipsUploads/',
    //req ->info peticion, file ->archivo que se sube, cb ->funcion finalizacion

    filename: function(req, file, cb) {
        //cb("",Date.now()+"_"+file.originalname +"." +mimeTypes.extension(file.mimetype));

        var numcarga = req.files.length;

        console.log("numero de archivos a cargar" + numcarga);


        //console.log("planos 10 - planos bd:"+num_archivos-numplanos);


        modelplanos.cantidad_RegistrosPlanos_tmp().then(rescount => {
            //count_temp=JSON.stringify(rescount);


            var ext = path.extname(file.originalname);

            var numplanos = Number(Object.values(rescount[0]));
            numplanos = numplanos + numcarga;

            modelplanos.consultar_RegistrosPlanos_tmp().then(rsta => {
                console.log(rsta);

                if (rsta == "") {

                    if (ext !== '.txt' && ext !== '.Txt') {
                        return cb("Solo se permite Archivos Formato .txt");

                    } else if (numplanos > 10) {
                        return cb("Solo se permite Maximo 10 Archivos planos");
                    } else {


                        //console.log("prueba plano");
                        let fech_now = Date.now();

                        let date_ = new Date(fech_now);

                        let fecha_completa = date_.getDate() + "" + (date_.getMonth() + 1) + "" + date_.getFullYear();
                        //let hora = date_.getHours() + "" + date_.getMinutes() ;

                        //let fecha_hora = fecha_completa + "_" + hora;

                        //console.log(req.body);

                        /*if (num_archivos < 0) {
                            cb("","max numero 10");
                        }*/



                        cb("", req.body.cbxips + "_" + fecha_completa + "_" + file.originalname);


                    }

                } else {


                    rsta.forEach(plano => {
                        console.log("nombre2" + plano['nombre_original']);
                        if (plano['nombre_original'] == file.originalname) {
                            return cb("Error: Archivo " + file.originalname + " esta cargado");
                        }
                        console.log("suma bd + archivos de carga" + numplanos);
                        if (numcarga > 10) {
                            return cb("Solo se permite Maximo 10 Archivos planos");
                        } else if (ext !== '.txt' && ext !== '.Txt') {
                            return cb("Solo se permite Archivos Formato .txt");

                        } else if (numplanos > 10) {
                            return cb("Solo se permite Maximo 10 Archivos planos");
                        } else {


                            //console.log("prueba plano");
                            let fech_now = Date.now();

                            let date_ = new Date(fech_now);

                            let fecha_completa = date_.getDate() + "" + (date_.getMonth() + 1) + "" + date_.getFullYear();
                            //let hora = date_.getHours() + "" + date_.getMinutes() ;

                            //let fecha_hora = fecha_completa + "_" + hora;

                            //console.log(req.body);

                            /*if (num_archivos < 0) {
                                cb("","max numero 10");
                            }*/



                            cb("", req.body.cbxips + "_" + fecha_completa + "_" + file.originalname);


                        }

                    });

                }



            });







        })


        //console.log(req.body);

    }

})

const upload = multer({
    storage: storage
});

//metodo de almacenamiento para los sportes cargados a un registro de indicador
const storage_soportes = multer.diskStorage({

    /*  Se define el path con la palabra reservada de multer destination donde se le indica la 
        ruta abosluta para la carga de los soportes desde el registro de indicador

        path : dir_soportes_ctm

        esta ruta absoluta esta definida como statica para el servidor y se puede cambiar,
        NOTA ::: SE DEBE CAMBIAR EN --> app.use(express.static(dir_soportes_ctm));
    */
    destination: dir_soportes_ctm,

    filename: function(req, file, cb) {
        //console.log(req.files);

        var ext = path.extname(file.originalname);
        //cb("",Date.now()+"_"+file.originalname +"." +mimeTypes.extension(file.mimetype));

        if (ext !== '.txt' && ext !== '.Txt' && ext !== '.pdf' && ext !== '.xlsx' && ext !== '.docx') {
            return cb("Solo se permite Archivos de texto(.txt), PDF(.pdf), Excel(.xlsx) o Word(.docx)");

        } else {

            let fech_now = Date.now();
            let date_ = new Date(fech_now);

            let fecha_completa_sinSeparador = date_.getDate() + "" + (date_.getMonth() + 1) + "" + date_.getFullYear() + "_";
            let hora = date_.getHours() + "_" + date_.getMinutes() + "_";

            console.log("nombre generado para el archivo : " + "_" + fecha_completa_sinSeparador + hora + file.originalname);
            cb("", "_" + fecha_completa_sinSeparador + hora + file.originalname);
        }
    }
});

const upload_soportes = multer({
    storage: storage_soportes
});



var auth = function(req, res, next) {
    if (req.session && req.session.admin)
        return next();
    else
        return res.redirect('/login');
};


const { Console, count } = require('console');
const { send } = require('process');
const { parse } = require('querystring');


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//-----------------------------------------------RUTAS--------------------------------------------------------//
//                                                                                                            //
//                                              17/03/2021                                                    //
//                                                                                                            //          
//                                                                                                            //      
////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.get('/', function(req, res) {
    //res.redirect('/obtenerRegistrosPlanos');
    res.redirect("/login");
})

app.post('/login', function(req, res) {
    //res.redirect('/obtenerRegistrosPlanos');
    res.render("paginas/login");
})

app.get('/login', function(req, res) {
    //res.redirect('/obtenerRegistrosPlanos');
    res.render("paginas/login");
})

app.get('/inicio/bips', auth, function(req, res) {
    res.redirect('/login-data');
    //res.setHeader('Content-type', 'text/html');
    //res.render("paginas/inicio", { user: req.session.user });

})

app.get('/login-data', auth, function(req, res) {
    res.render("paginas/inicio", { user: req.session.username['nombre'], area: req.session.username['nombre_area'] });
    //res.setHeader('Content-type', 'text/html');
    //res.render("paginas/inicio", { user: req.session.user });

})

app.get('/obtenerRegistrosPlanos', auth, function(req, res) {
    modelbips.obtenerRegistrosPlanos().then(registroplanos => {

            console.log(registroplanos);

            res.render("paginas/RegistrosPlanos", {
                registroplanos: registroplanos,
                user: req.session.user,
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send("Error obteniendo registros");
        });
});


app.get('/cargar-plano', auth, function(req, res) {

    modelbips.obtenerIps().then(listaIps => {

            res.render("paginas/FormularioCarga", {
                listaIps: listaIps,
                user: req.session.user,

            });

        })
        .catch(err => {
            console.log(err);
            return res.status(500).send("Error obteniendo registros");
        });
});

app.get('/validar-registros-ap/:ips', auth, async function(req, res, next) {


    modelbips.validarRegistrosAP(req.params.ips, req.query.fecha_inicial, req.query.fecha_fin).then(validaregistros => {
        const respuesta = validaregistros.rows[0].total_reg;
        console.log(respuesta);
        res.setHeader('Content-type', 'text/javascript');
        res.send(respuesta);
    });
});

app.get('/cargar', auth, function(req, res) {
    //console.log(req);
    res.render("paginas/FormularioCarga");
});



app.post("/files", auth, upload.array('files'), (req, res, err) => {




    //console.log(req.files);
    //console.log(req.files.length);

    //num_archivos = num_archivos - req.files.length;

    //console.log(num_archivos);
    //console.log(req.body);
    /*if (num_archivos < 0) {
        console.log("max num archivos 10");
    } else*/

    let periodo = req.body.txtfecha_inicial + " - " + req.body.txtfecha_fin;

    let fech_now = Date.now();

    let date_ = new Date(fech_now);

    let fecha_completa = date_.getDate() + "/" + (date_.getMonth() + 1) + "/" + date_.getFullYear();
    let fecha_completa_sinSeparador = date_.getDate() + "" + (date_.getMonth() + 1) + "" + date_.getFullYear() + "_";
    let hora = date_.getHours() + ":" + date_.getMinutes() + ":" + date_.getSeconds();

    let fecha_hora = fecha_completa + " " + hora;

    //console.log(fecha_hora);

    for (var i in req.files) {

        let path_ins = path.join(__dirname + "/" + 'filesBipsUploads/' + req.body.cbxips + "_" + fecha_completa_sinSeparador + req.files[i].originalname);
        let nombre_temp = req.body.cbxips + "_" + fecha_completa_sinSeparador + req.files[i].originalname;

        console.log("cbxips" + req.body.cbxips);

        try {


            modelplanos.insertar_RegistrosPlanos_tmp(

                req.body.cbxips,
                req.body.nombre_ips,
                periodo,
                req.files[i].originalname,
                req.files[i].mimetype,
                fecha_hora,
                '0',
                nombre_temp,
                path_ins,

            ).then(respuesta => {
                //console.log(respuesta['command'] + " : " + respuesta['rowCount']);
                if (respuesta['command'] == "INSERT" && respuesta['rowCount'] > 0) {
                    console.log("OK... upload");
                    //num_archivos--;
                    //console.log("archivos insert "+num_archivos);

                }
            });

        } catch (error) {
            console.log("err " + error);

        }

    }


    res.setHeader('Content-type', 'application/json');
    res.send('{"estado":"200","respuesta": "La operacion se ejecuto con exito.."}');


});

app.get("/listadoArchivos", auth, (req, res) => {

    var bandera_panel_envio = false;
    var habilitar_carga_bandera = false;
    var habilitar_eliminar_all = true;
    var bandera_btn_enviar = false;
    modelplanos.ObtenerPlanos_validos().then(planos_val => {

        //console.log(planos_val);
        modelplanos.validarPlanosNecesarios(planos_val).then(rsta => {
            //console.log(rsta);
            if (rsta == 1) {
                bandera_panel_envio = true;

                modelplanos.consultar_RegistrosPlanos_tmp().then(planos_all => {

                    modelplanos.contar_Planos_Validados().then(conteo_planos => {
                        //console.log(conteo_planos);
                        if (conteo_planos[0]['total_validados'] >= 10) {

                            bandera_btn_enviar = false;
                            habilitar_carga_bandera = true;
                            habilitar_eliminar_all = false;



                            modelplanos.validarPlanosCargados(planos_all).then(rsta_cargados => {
                                //console.log(rsta_cargados);
                                if (rsta_cargados == 0) {

                                    habilitar_carga_bandera = false;

                                    bandera_btn_enviar = true;

                                    habilitar_eliminar_all = false;



                                    res.setHeader('Content-type', 'text/html');
                                    res.render("paginas/listaArchivos", {
                                        arr_files: planos_all,
                                        habilitar_envio_la: bandera_panel_envio,
                                        habilitar_carga: habilitar_carga_bandera,
                                        habilitar_eliminar: habilitar_eliminar_all,
                                        habilitar_btn_envio: bandera_btn_enviar,
                                    });

                                } else {

                                    modelplanos.consultar_RegistrosPlanos_tmp().then(listaArchivos => {
                                        res.render("paginas/listaArchivos", {
                                            arr_files: listaArchivos,
                                            habilitar_envio_la: bandera_panel_envio,
                                            habilitar_carga: habilitar_carga_bandera,
                                            habilitar_eliminar: habilitar_eliminar_all,
                                            habilitar_btn_envio: bandera_btn_enviar,
                                        });

                                    });


                                }


                            });


                        } else {

                            bandera_panel_envio = false;

                            //console.log(listaArchivos);    
                            res.setHeader('Content-type', 'text/html');
                            res.render("paginas/listaArchivos", {
                                arr_files: planos_all,
                                habilitar_envio_la: bandera_panel_envio,
                                habilitar_carga: habilitar_carga_bandera,
                                habilitar_eliminar: habilitar_eliminar_all,
                                habilitar_btn_envio: bandera_btn_enviar,
                            });

                        }



                    }).catch(err => {
                        console.log(err);
                        return res.status(500).send("Error obteniendo registros");
                    });


                });



            } else {

                modelplanos.consultar_RegistrosPlanos_tmp().then(listaArchivos => {
                    res.render("paginas/listaArchivos", {
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

app.get('/recursos_marca', function(req, res) {

    res.sendFile(__dirname + "/src/vista/paginas/recursos/marca_final.png");

});
app.get('/recursos_marca_bn', function(req, res) {

    res.sendFile(__dirname + "/src/vista/paginas/recursos/marca_final2.png");

});

app.get('/recursos_it', function(req, res) {

    res.sendFile(__dirname + "/src/vista/paginas/recursos/it.png");

});


app.post('/file/delete/:name/archivo-bips', auth, function(req, res) {
    let name = req.params.name;
    console.log(req.query);
    //console.log(name);
    fs.unlink(path.join(__dirname + "/" + 'filesBipsUploads/' + name), (err) => {
        if (err) {
            console.log(err)
            res.send({
                status: 1,
                msg: 'No se pudo borrar el archivo,posiblemente este ya NO existe, por favor contacte con el administrador'
            })
        } else {
            //res.status("200").send("OK");
            var array_nombre = name.split('_');
            console.log("nombre_original " + array_nombre[2]);

            modelplanos.eliminar_RegistrosPlanos_tmp(req.query.id_ips, name).then(respuesta => {

                if (respuesta['command'] == "DELETE" && respuesta['rowCount'] > 0)
                    console.log("respuesta de eliminacion: 1");

                modelplanos.consultar_RegistrosPlanos_tmp().then(listaArchivos => {

                        req.flash('notify', 'El archivo plano ' + array_nombre[2] + ' se eliminó correctamente...');
                        res.redirect("/listadoArchivos");

                    })
                    .catch(err => {
                        console.log(err);
                        return res.status(500).send("Error obteniendo registros");
                    });
            })
        }
    })
});


app.post('/file/validar/:name/archivo-bips', auth, function(req, res) {

    let name_tmp = req.params.name;
    var array_nombre = name_tmp.split('_');
    let nombre_txt = array_nombre[2];

    var nombre_plano = nombre_txt.slice(0, 2);
    var habilita_eliminar_todos = false;
    //console.log("nombre_PLANO:" + nombre_plano);
    //console.log(name_tmp);
    //console.log("nombre_original " + nombre_txt);
    //console.log(req.query);
    //console.log(name);

    modelplanos.contar_Planos_Validados().then(cont_planos_val => {
        if (cont_planos_val.total_validados >= 1) {
            habilita_eliminar_todos = true;
        }

    });

    modelvalidaciones.validarPlano(name_tmp, nombre_plano).then(rsta_validacion => {

        //si la respuesta de validacion del plano, retorna la respuesta vacia ""
        //significa que el plano se valido CORRECTAMENTE.
        if (rsta_validacion == "") {
            modelplanos.validar_RegistrosPlanos_tmp(req.query.id_ips, name_tmp).then(respuesta => {
                if (respuesta['command'] == "UPDATE" && respuesta['rowCount'] > 0) {

                    console.log("actualizo OK... ");
                    //Aqui se valida por cada iteracion de validacion de planos si todos se encuentran validados,
                    //esto con el fin de habilitar el boton de envio de los planos ya validados, tener en cuenta los planos
                    //que son necesarios AP, AC, AT, AH, AU , AF


                    modelplanos.ObtenerPlanos_validos().then(planos_val => {
                        modelplanos.validarPlanosNecesarios(planos_val).then(rsta => {

                            //console.log("cod_estado server"+cod_estado);

                            //Si la validacion de los planos necesarios resulta con exito "1" -> rsta = 1, el sistema debera habilitar el boton de 
                            //envio para el trabajo, habilitar_envio: true

                            if (rsta == 1) {


                                //despues de realizar la validacion del plano y la carga con su transformacion, se debera responder a la vista
                                //validando que la transformacion se ha ejecutado con EXITO cod_estado = o

                                //if (cod_estado == 0) {
                                console.log('El plano ' + nombre_plano + ' fue validado correctamente...');
                                req.flash('notify', 'El Archivo Plano ' + nombre_plano + ' fue validado correctamente...');
                                res.json({ respuesta: "OK", status: 200, habilitar_envio: true, habilitar_elim_all: habilita_eliminar_todos, descripcion: 'El plano ' + nombre_plano + ' fue validado correctamente...' });
                                // } else {
                                // console.error("Ocurrio un problema con la ejecucion del comando/tranformacion_ rspta de retorno: ");
                                //}



                            } else {

                                //despues de realizar la validacion del plano y la carga con su transformacion, se debera responder a la vista
                                //validando que la transformacion se ha ejecutado con EXITO                                
                                //Se debe validar la respuesta

                                //if (cod_estado == 0) {
                                console.log('El plano ' + nombre_plano + ' fue validado correctamente:');
                                req.flash('notify', 'El Archivo Plano ' + nombre_plano + ' fue validado correctamente...');
                                res.json({ respuesta: "OK", status: 200, habilitar_envio: false, habilitar_elim_all: habilita_eliminar_todos, descripcion: 'El plano ' + nombre_plano + ' fue validado correctamente...' });
                                // }else {
                                //console.error("Ocurrio un problema con la ejecucion del comando/tranformacion_ rspta de retorno: " );
                                //}
                            }
                        });

                    });
                } else {
                    req.flash('error', 'El Archivo Plano ' + nombre_plano + 'No se logro actualizar en BD, error actualizando, validado NO');
                    res.json({ error: 500, respuesta: 'El Archivo Plano ' + nombre_plano + ' tiene los siguientes errores:' + rsta_validacion });
                }

            }).catch(err => {
                console.log(err);
                return res.status(500).send("Error obteniendo registros");
            });



        } else { //si la respuesta de validacion NO esta vacia, se retornan los errores encontrados


            Object.entries(rsta_validacion).forEach(([key, value]) => {

                //console.log(`${value}`);
                //console.log(`${value}`); // "a 5", "b 7", "c 9"
                //console.log(`${key}`);

            });



            req.flash('error', 'El Archivo Plano ' + nombre_plano + ' tiene los siguientes errores:' + rsta_validacion);
            res.json({ error: 500, respuesta: 'El Archivo Plano ' + nombre_plano + ' tiene los siguientes errores:' + rsta_validacion });
            console.log("cantidad de errores:" + rsta_validacion.length);



            //console.log("select respuesta:"+rsta_validacion);



        }
        //console.log("Archivo validado");
    })

});

app.get("/reportes-2193", auth, (req, res) => {

    res.render(path.join(__dirname + "/src/vista/paginas/GeneradorReportes"), { user: req.session.user, area: req.session.username['nombre_area'] });
});

app.get("/olap-2193", auth, (req, res) => {
    res.render(path.join(__dirname + "/src/vista/paginas/Olap_2193"), { user: req.session.user, area: req.session.username['nombre_area'] });
});

app.get("/eliminar-popup/:name/archivo-bips", auth, (req, res) => {
    //console.log(req.query);

    var name = req.query.nombre_tmp;
    var array_nombre = name.split('_');

    var name_ips = req.query.nombre_ips;
    var array_nombre_ips = name_ips.split('(');

    nombre_corto_ips = array_nombre_ips[1].substring(0, array_nombre_ips[1].length - 1);
    //console.log(array_nombre_ips[1].substring(0, array_nombre_ips[1].length - 1));

    let params = [req.query.id_ips, array_nombre[2], nombre_corto_ips, req.query.nombre_tmp];

    console.log(params);
    res.render(path.join(__dirname + "/src/vista/paginas/popup-eliminar"), { datos_plano: params });
});

app.post("/delete-all/archivo-bips", auth, (req, res) => {
    //metodo para eliminar todos los archivos planos cargados
    fs.readdir(path.join(__dirname, 'filesBipsUploads'), (err, files) => {

        if (err) {
            console.log(err);
            res.json({ resultado: err });
        } else if (files.length == 0) {

            res.json({ resultado: "DATA_NOT_FOUND" });
        } else {
            console.log("Los archivos encontrados son: ");
            files.forEach(file => {
                try {
                    var ruta = path.join(__dirname, 'filesBipsUploads') + '/' + file;
                    fs.unlinkSync(ruta);
                } catch (error) {
                    console.error('Something wrong happened removing the file', error)
                }
            });

            modelplanos.eliminar_all_RegistrosPlanos_tmp().then(respuesta => {

                    if (respuesta['command'] == "DELETE" && respuesta['rowCount'] > 0) {
                        console.log("respuesta de eliminacion- Total eliminados:" + respuesta['rowCount']);
                    }

                })
                .catch(err => {
                    console.log(err);
                });

            req.flash("notify", "Los archivos fueron eliminados correctamente..");
            res.json({ resultado: "OK", status: 200 });


        }

    });
});

app.post("/enviar-trabajo/ejecucion/archivo-bips", auth, (req, res) => {

    //RETORNA  O CUANDO TERMINA EL TRABAJO EXITOSO  

    //Se realiza el llamado de la funcion que permite ejecutar el trabajo con la herramienta kitchen de spoon
    //modelktr.ejecucionJob().then(rsta => console.log("La respuesta de ejecucion del trabajo es "+rsta));

    const path = require('path');
    const fs = require('fs');
    const spawn = require('child_process').spawn;

    console.log("===========================================================================");
    console.log("================Inicia ejecucion de la job      =================");
    console.log("fecha/hora de inicio de la ejecucion : ");
    //modelktr.obtener_fecha_hora().then(fh => console.log(fh));
    console.log("===========================================================================");

    const spawn_job = spawn('sh', ['/var/lib/PENTAHO_/data-integration/kitchen.sh', "-file=src/integracionKjb/Job_reporte2193.kjb", '-level=Basic', '-logfile=/tmp/trans.log']);

    spawn_job.stdout.pipe(process.stdout);


    spawn_job.stdout.on('data', data => {
        console.log(`stdout:\n${data}`)

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

                var cont = rsta.length;
                var bandera = false;

                rsta.forEach(plano => {
                    ruta = plano["path_plano"];


                    try {
                        //var ruta = path.join(__dirname, 'filesBipsUploads') + '/' + file;
                        fs.unlinkSync(ruta, function(err) {
                            if (err) {
                                bandera = true;
                                return console.error(err);
                            }

                        });


                    } catch (error) {
                        console.error('Something wrong happened removing the file', error)
                    }

                })

                if (!bandera) {

                    modelplanos.eliminar_all_RegistrosPlanos_tmp_validos().then(rsta_elim => {
                        if (rsta_elim['command'] == "DELETE" && rsta_elim['rowCount'] > 0) {
                            console.log("respuesta de eliminacion: 1, todos los planos fueron eliminados en bd y proyecto");
                            req.flash('notify', 'informacion fue cargada exitosamente...');
                            res.json({ respuesta: "OK", status: 200, retorno: code.toString(), descripcion: 'El trabajo se ejecuto con exito... ' });

                        }
                    });
                }


            });





        } else {
            res.status(200).send(code.toString());
            console.error('Ocurrio un problema con la ejecucion del comando/job CODE:' + code);
        }

    });









});

app.post("/enviar-carga/ejecucion-multiple/archivo-bips", auth, (req, res) => {

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
            console.log("===========================================================================");
            console.log("================Inicia ejecucion de la transformacion      =================");
            console.log("fecha/hora de inicio de la ejecucion : ");
            //obtener_fecha_hora().then(rt=>{
            //  console.log(rt);

            //            });
            console.log("===========================================================================");


            /*
                    La función spawn lanza un comando en un nuevo proceso y podemos usarlo para pasarle cualquier argumento a ese comando
            
                    */
            //let spawn_trs = spawn('sh', ['/var/lib/data-integration/pan.sh', "-file=src/IntegracionKtr/" + nombre_transformacion, '-level=Basic', "-param:ruta_archivo_af=" + path_plano_AF, '-logfile=/tmp/trans.log']);
            var spawn_trs = spawn('sh', ['/var/lib/PENTAHO_/data-integration/pan.sh', "-file=src/IntegracionKtr/tras-all-Planos.ktr", '-level=Detailed',
                "-param:ruta_archivo_af=" + path_plano_AF,
                "-param:ruta_archivo_ac=" + path_plano_AC,
                "-param:ruta_archivo_at=" + path_plano_AT,
                "-param:ruta_archivo_an=" + path_plano_AN,
                "-param:ruta_archivo_am=" + path_plano_AM,
                "-param:ruta_archivo_ap=" + path_plano_AP,
                "-param:ruta_archivo_ct=" + path_plano_CT,
                "-param:ruta_archivo_us=" + path_plano_US,
                "-param:ruta_archivo_au=" + path_plano_AU,
                "-param:ruta_archivo_ah=" + path_plano_AH,

                '-logfile=/tmp/trans.log'
            ]);

            //const spawn_trs = spawn('ls',['-ltr','/var/lib/data-integration']);

            //const spawn_trs = spawn('ls', ['-ltr']);

            //la opcion pipe canaliza spawn_trs.stdout directamente a process.stdout
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


                        }

                    });
                    //num_planos--;
                    //return 0;      
                    //console.log("numero de planos decrementando: " + num_planos);

                    modelplanos.consultar_RegistrosPlanos_tmp().then(listaArchivos => {
                            //console.log(listaArchivos);    
                            req.flash('notify', 'La carga de los Planos se realizo con exito...');
                            //res.setHeader('Content-type', 'text/html');
                            res.render("paginas/listaArchivos", {
                                arr_files: listaArchivos,
                                habilitar_envio_la: true,
                                habilitar_carga: false,
                                habilitar_eliminar: false,
                                habilitar_btn_envio: true,
                                status: 200,
                                code: 0,
                                retorno: "0",
                            });


                        })
                        .catch(err => {
                            console.log(err);
                            return res.status(500).send("Error obteniendo registros");
                        });

                    //req.flash('notify', 'La carga de los Planos se realizo con exito...');
                    /*res.json({
                        status: 200,
                        code: 0,
                        retorno: "0",
                        descripcion: 'La operacion de carga multiple se ejecuto con exito',

                    });*/





                } else {
                    console.error('Ocurrio un problema con la ejecucion del comando/transformacion ' + code);
                    //se retorna el codigo de estado de errro
                    //return 1;
                    req.flash('error', 'Ocurrio un error en la carga de los planos, Contacte con el administrador... Cod.Transformacion: ' + code);
                    modelplanos.consultar_RegistrosPlanos_tmp().then(listaArchivos => {


                        res.render("paginas/listaArchivos", {
                            arr_files: listaArchivos,
                            habilitar_envio_la: true,
                            habilitar_carga: true,
                            habilitar_eliminar: false,
                            habilitar_btn_envio: false,
                            status: 200,
                            code: code,
                            retorno: "0",
                        });
                    });


                }



            });

            spawn_trs.on('exit', (code) => {
                console.log(`exit child process exited with code ${code}`);
                //return code;
            });

        }


        //});









    });





});


app.post('/login-data', function(req, res) {

    //console.log(req.body.username);
    console.log(req.query);
    console.log(req.params);
    console.log(req.body);

    //var username="'"+req.body.username+"'";
    //var password ="'"+req.body.password+"'";

    modelSecurity.consultar_usuario_registrado(req.body.username).then(user_reg => {

        if (user_reg[0].total_usuarios == 0) {

            req.flash("error", ' Usuario NO registrado en el sistema Bips');
            //res.send({ status: 500, descripcion: "Error al realizar login, usuario NO registrado" });
            res.render("paginas/login");
        } else {


            modelSecurity.validacion_user_password(req.body.username, req.body.password).then(user_ok => {
                //modelSecurity.validacion_user_password().then(user_ok => {

                //console.log("resp_user1"+Object.entries(user_ok));
                //console.log(user_ok[0].pwd);
                //console.log(user_ok[0].nombre_usuario);

                if (user_ok[0].pwd == true) {
                    //console.log("entro en validacion");

                    //var usuario = { id: user_ok[0].id, username: req.body.username, id_area: user_ok[0].id_area, nombre: user_ok[0].nombre };

                    if (user_ok[0].es_profesional) {

                        console.log("Es profesional");
                        modelControlMando.consultarProfesionalXidUsuario(Number(user_ok[0].id)).then(result => {
                            console.log(result);

                            modelControlMando.consultar_areaxid(result[0].id_area_trabajo).then(area => {

                                modelControlMando.consultarPermisosRol(user_ok[0].rol).then(result_permisos => {
                                    console.log(result_permisos);
                                    var usuario = {
                                        id_user: user_ok[0].id,
                                        id_profesional: Number(result[0].id_profesional),
                                        username: req.body.username,
                                        id_area: user_ok[0].id_area,
                                        nombre: user_ok[0].nombre,
                                        nombre_rol: user_ok[0].nombre_rol,
                                        rol: user_ok[0].rol,
                                        permisos: result_permisos,
                                        nombre_area: area[0].nombre_area
                                    };



                                    req.session.user = user_ok[0].nombre_usuario;
                                    req.session.admin = true;
                                    req.session.web = "http://192.168.1.84:3000";
                                    req.session.username = usuario;
                                    //req.session. = user_ok[0].id;
                                    //console.log(req);

                                    //console.log(listaArchivos);    
                                    //req.flash('notify', 'La carga de los Planos se realizo con exito...');
                                    //res.setHeader('Content-type', 'text/html');
                                    //res.redirect("/config-entidades");                            
                                    //console.log(listaArchivos);    

                                    //console.log(listaArchivos);    
                                    req.flash('notify', 'Inicio de sesion con exito...');
                                    //res.setHeader('Content-type', 'text/html');
                                    //res.redirect("/config-entidades");

                                    res.render("paginas/inicio", { user: req.session.username['nombre'], area: req.session.username['nombre_area'] });
                                    /*res.render("paginas/entidades", {
                                        registroEntidades: listaentidades,
                                        status: 200,
                                        code: 0,
                                        retorno: "0",
                                        user: user_ok[0].nombre_usuario,
                                    });*/
                                    //res.setHeader('Content-type', 'text/html');
                                    //res.redirect("/config-entidades");

                                    /*res.render("paginas/entidades", {
                                        registroEntidades: listaentidades,
                                        status: 200,
                                        code: 0,
                                        retorno: "0",
                                        user: user_ok[0].nombre_usuario,
                                    });*/





                                });

                            });

                        });
                    } else {

                        var usuario = {
                            id: user_ok[0].id,
                            id_profesional: 0,
                            username: req.body.username,
                            id_area: user_ok[0].id_area,
                            nombre: user_ok[0].nombre,
                            nombre_rol: user_ok[0].nombre_rol,
                            rol: user_ok[0].rol,
                            permisos: {}
                        };
                        req.session.user = user_ok[0].nombre_usuario;
                        req.session.admin = true;
                        req.session.web = "http://192.168.1.84:3000";
                        req.session.username = usuario;

                        //console.log(listaArchivos);    
                        req.flash('notify', 'Inicio de sesion con exito...');
                        //res.setHeader('Content-type', 'text/html');
                        //res.redirect("/config-entidades");
                        res.render("paginas/inicio", { user: req.session.username['nombre'] });
                        /*res.render("paginas/entidades", {
                            registroEntidades: listaentidades,
                            status: 200,
                            code: 0,
                            retorno: "0",
                            user: user_ok[0].nombre_usuario,
                        });*/

                    }






                } else {
                    req.flash("error", ' La contraseña ingresada es incorrecta');
                    // res.send({ status: 500, descripcion: "Error al realizar login, password incorrecto" });
                    res.render("paginas/login");
                }


            });

        }


    });



});


// Logout endpoint
app.get('/logout', auth, function(req, res) {
    req.session.destroy();
    res.redirect("/login");
});



app.get("/config-entidades", auth, (req, res) => {

    modelEntidad.consultar_registro_entidades().then(listaentidades => {
            console.log(req.query);

            //req.flash('notify', 'La carga de los Planos se realizo con exito...');
            //res.setHeader('Content-type', 'text/html');
            res.render("paginas/entidades", {
                registroEntidades: listaentidades,
                status: 200,
                code: 0,
                retorno: "0",
                user: req.session.user,
            });


        })
        .catch(err => {
            console.log(err);
            return res.status(500).send("Error obteniendo registros");
        });

});

app.get("/form-crear-entidad", auth, (req, res) => {
    //res.send("OK");
    res.render("paginas/new-entidad", { user: req.session.user, });

})

app.post("/form-editar-entidad/:id_ent", auth, (req, res) => {
    //res.send("OK");
    //console.log(req.query);
    //console.log(req.params);

    //Se deben consultar los datos de la entidad con el parametro de entrada cod_ent

    // consultar_registro_entidad_x_id(id_entidad) 
    modelEntidad.consultar_registro_entidad_x_id(req.params.id_ent).then(resultado => {

        //console.log(resultado);
        res.render("paginas/editar-entidad", { user: req.session.user, res_cod_ent: resultado[0].cod_entidad, res_nombre_ent: resultado[0].nombre_entidad, res_tipo_reg: resultado[0].tipo_reg, res_id_entidad: resultado[0].id_entidad });

    }).catch(err => {
        console.log(err);
        return res.status(500).send("Error obteniendo registros");
    });



})

app.get("/form-editar-entidad", auth, (req, res) => {

    res.redirect("/config-entidades");

})

app.post("/persistir-entidad", auth, (req, res) => {
    //res.send("OK");
    //console.log(req.query);
    //console.log(req.params);

    modelEntidad.obtener_mayor_id_entidad().then(respuesta__max => {

        modelEntidad.insertar_registro_entidades(req.query.cod_entidad, req.query.nombre_entidad, req.query.tipo_reg, respuesta__max[0].max + 1).then(respuesta => {

            if (respuesta['command'] == "INSERT" && respuesta['rowCount'] > 0) {
                console.log("OK... insert NEW entidad");
                //console.log(listaArchivos);    
                //req.flash('notify', 'La carga de los Planos se realizo con exito...');
                //res.setHeader('Content-type', 'text/html');
                //req.flash('notify', 'La entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' se creó correctamente...');
                res.json({ status: 200, msg: 'La Entidad <b>' + req.query.nombre_entidad + '</b>, con codigo <b>' + req.query.cod_entidad + '</b> se creó correctamente...' });
            } else {

                //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' intente de nuevo...');
                res.json({ status: 300, msg: 'ERROR al crear la entidad <b>' + req.query.nombre_entidad + '</b>, con codigo <b>' + req.query.cod_entidad + '</b> intente de nuevo...' });
            }

        }).catch(err => {
            console.log(err);
            //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' Ya existe...');
            res.json({ status: 500, msg: 'ERROR!! La Entidad <b>' + req.query.nombre_entidad + '</b>, con codigo <b>' + req.query.cod_entidad + '</b> YA EXISTE...' });
        });



    }).catch(err => {
        console.log(err);
        //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' Ya existe...');
        res.json({ status: 500, msg: 'ERROR!! La Entidad <b>' + req.query.nombre_entidad + '</b>, con codigo <b>' + req.query.cod_entidad + '</b> YA EXISTE...' });
    });


})

app.post("/actualizar-entidad", auth, (req, res) => {
    //res.send("OK");
    console.log(req.query);
    console.log(req.params);
    console.log(req.body);
    modelEntidad.actualizar_registro_entidades(req.query.cod_entidad, req.query.nombre_entidad, req.query.tipo_reg, req.query.id_ent).then(respuesta => {

        if (respuesta['command'] == "UPDATE" && respuesta['rowCount'] > 0) {
            console.log("OK... update entidad");
            //console.log(listaArchivos);    
            //req.flash('notify', 'La carga de los Planos se realizo con exito...');
            //res.setHeader('Content-type', 'text/html');
            req.flash('notify', 'La entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' se actualizo correctamente...');
            res.send({ status: 200, msg: 'La Entidad <b>' + req.query.nombre_entidad + '</b>, con codigo <b>' + req.query.cod_entidad + '</b> fue actualizada correctamente...' });
            //res.render("/config-entidades");

        } else {

            //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' intente de nuevo...');
            res.send({ status: 300, msg: 'ERROR al actualizar la entidad <b>' + req.query.nombre_entidad + '</b>, con codigo <b>' + req.query.cod_entidad + '</b> intente de nuevo...' });
        }

    }).catch(err => {
        console.log(err);
        //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' Ya existe...');
        res.json({ status: 500, msg: 'ERROR!! La Entidad <b>' + req.query.nombre_entidad + '</b>, con codigo <b>' + req.query.cod_entidad + '</b> NO se pudo actualizar...' });
    });

})

app.post("/config-entidades", auth, (req, res) => {

    modelEntidad.consultar_registro_entidades().then(listaentidades => {
            //console.log(listaArchivos);    
            //req.flash('notify', 'La carga de los Planos se realizo con exito...');
            //res.setHeader('Content-type', 'text/html');
            res.render("paginas/entidades", {
                registroEntidades: listaentidades,
                status: 200,
                code: 0,
                retorno: "0",
            });


        })
        .catch(err => {
            console.log(err);
            return res.status(500).send("Error obteniendo registros");
        });

});


app.post("/eliminar-popup-entidad/:name/archivo-bips", auth, (req, res) => {

    /*console.log(req.params.name);        
    console.log(req.query.regimen);
    console.log(req.session.admin);*/
    res.render(path.join(__dirname + "/src/vista/paginas/popup-eliminar-entidad"), { datos_entidad: req.params.name, regimen_: req.query.regimen, nombre_entidad: req.query.nombre_entidad });
});

app.post('/file/delete-entidad/:name/archivo-bips', auth, function(req, res) {

    if (req.query.regimen == "CONTRIBUTIVO") {
        var regimen = "C"
    } else if (req.query.regimen == "OTRO") {
        var regimen = "O"
    } else if (req.query.regimen == "SUBSIDIADO") {
        var regimen = "S"
    } else if (req.query.regimen == "VINCULADO") {
        var regimen = "C"
    } else if (req.query.regimen == "ESPECIAL") {
        var regimen = "E"
    }

    if (req.query.nombre_entidad == "") {
        var nombre_entidad = "de Nombre 'No asignado' ";
    } else {
        var nombre_entidad = req.query.nombre_entidad;
    }
    modelEntidad.eliminar_registro_entidades(req.params.name, regimen).then(respuesta => {
        console.log(req.params.name);
        console.log(req.query.regimen);
        if (respuesta['command'] == "DELETE" && respuesta['rowCount'] > 0)
            console.log("respuesta de eliminacion: 1");



        //console.log(listaArchivos);    
        //req.flash('notify', 'La carga de los Planos se realizo con exito...');
        //res.setHeader('Content-type', 'text/html');
        req.flash('notify', 'La entidad ' + nombre_entidad + ' con codigo ' + req.params.name + ' y regimen ' + req.query.regimen + ' se eliminó correctamente...');
        res.redirect("/config-entidades");


    })



})

app.get("/test-header", (req, res) => {
    res.render("paginas/test_header_new", { area: req.session.username['nombre_area'] });
});

app.get("/config-user-bips", auth, (req, res) => {
    res.render("paginas/config_user", { user: req.session.user, });
});

app.get("/config-perfil-bips", auth, (req, res) => {

    var url = path.join(__dirname + "/" + 'filesBipsUploads/' + 'example_pdf.pdf');
    res.render("paginas/config_perfil", { user: req.session.user, url: url });
});

app.get("/file-view-pdf", auth, (req, res) => {

    var url = path.join(__dirname + "/" + 'filesBipsUploads/' + 'example_pdf.pdf');
    res.send('ok', { user: req.session.user, url: url });
});

app.get("/gestion-bips", auth, (req, res) => {
    res.render("paginas/gestion", { user: req.session.user, });
});

app.get("/estado-cartera-bips", auth, (req, res) => {
    res.render("paginas/estado_cartera", { user: req.session.user, });
});

app.get("/estado-recaudo-bips", auth, (req, res) => {
    res.render("paginas/estado_recaudo", { user: req.session.user, });
});

app.get("/control-mando", auth, (req, res) => {
    res.render("paginas/control_mando", {
        user: req.session.username['nombre'],
        nombre_rol: req.session.username['nombre_rol'],
        rol: req.session.username['rol'],
        permisos: req.session.username['permisos'],
        area: req.session.username['nombre_area']
    });
});

app.get("/menu-ctm", auth, (req, res) => {

    //console.log(lista_planes);
    res.render("paginas/menu_cuadro_mando", { nombre_rol: req.session.username['nombre_rol'], rol: req.session.username['rol'], permisos: req.session.username['permisos'] });



});

app.get("/ctm-plan-general", auth, (req, res) => {
    res.render("paginas/plan_general", { nombre_rol: req.session.username['nombre_rol'], rol: req.session.username['rol'] });
});

app.get("/listado-ctm-planes-generales", auth, (req, res) => {

    modelControlMando.consultar_RegistrosPlan_General().then(lista_planes => {
        //console.log(lista_planes);
        res.render("paginas/lista_planGral", { lista_planes: lista_planes });
    });


});
///form-editar-ctm-plan-general
app.post("/form-editar-ctm-plan-general", auth, (req, res) => {

    //res.send('OK');

    //consultar_RegistrosPlan_General_x_id
    modelControlMando.consultar_RegistrosPlan_General_x_id(req.query.id_plan).then(info_plan => {
        res.render("paginas/editar_planGral", { id_plan: req.query.id_plan, info_plan: info_plan });

    });



});

//"/actualizar-plan
app.post("/actualizar-plan-general", auth, (req, res) => {
    //res.send("OK");
    console.log(req.query);
    console.log(req.params);
    console.log(req.body);
    modelControlMando.actualizar_RegistrosPlan_General_x_id(req.query.id_plan, req.query.nombre_plan, req.query.fecha_inicial, req.query.fecha_fin, req.query.activo).then(respuesta => {
        console.log(respuesta);
        if (respuesta['command'] == "UPDATE" && respuesta['rowCount'] > 0) {
            console.log("OK... update plan general");
            //console.log(listaArchivos);    
            //req.flash('notify', 'La carga de los Planos se realizo con exito...');
            //res.setHeader('Content-type', 'text/html');
            //req.flash('notify_up_plangral', 'El plan general ' + req.query.nombre_plan + ',' + ' se actualizo correctamente...');
            res.send({ status: 200, msg: 'El plan General ' + req.query.nombre_plan + ' fue actualizado correctamente...' });
            //res.render("/config-entidades");

        } else {

            //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' intente de nuevo...');
            res.send({ status: 300, msg: 'ERROR al actualizar el plan general ' + req.query.nombre_plan + ' ' + ' intente de nuevo...' });
        }

    }).catch(err => {
        console.log(err);
        //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' Ya existe...');
        res.json({ status: 500, msg: 'ERROR!! El plan general  ' + req.query.nombre_plan + ', ' + +'NO se pudo actualizar...' });
    });

})

app.get("/eliminar-popup-plan-general/:id_plan/control-mando-bips", auth, (req, res) => {
    // console.log(req.query);
    //console.log(req.params);
    //var name = req.query.;    

    let params = [req.params.id_plan, req.query.nombre_plan];
    res.render(path.join(__dirname + "/src/vista/paginas/popup-eliminar-plangeneral"), { datos_plan: params });
});

//plan-general/delete/

app.post('/plan-general/delete/:id/control-mando-bips', auth, function(req, res) {

    console.log(req.query);
    console.log(req.params);
    var msg = '';

    modelControlMando.consultar_LineasAccionXplangral(req.params.id).then(rspta_eliminacion => {

        console.log(rspta_eliminacion);
        if (rspta_eliminacion.length == 0) {

            modelControlMando.eliminar_RegistroPlan_General(req.params.id).then(respuesta => {

                msg = 'El plan general ' + req.query.nombre_plan + ' se eliminó correctamente...';
                if (respuesta['command'] == "DELETE" && respuesta['rowCount'] > 0) {
                    console.log("respuesta de eliminacion: 1, Se elimino correctamente el plan general...");
                    msg = 'El plan general ' + req.query.nombre_plan + ' se eliminó correctamente...';
                } else {
                    console.log("respuesta de eliminacion: ERROR... 0, ocurrio un problema al eliminar el plan general " + req.query.nombre_plan);
                    msg = ' ocurrio un problema al eliminar el plan general... ' + req.query.nombre_plan;
                }
            })

        } else {

            msg = 'El plan general ' + req.query.nombre_plan + ' NO  se puede Eliminar, tiene asociada una Linea de Acción...';
        }

        req.flash('notify_del_plangral', msg);
        //res.json({ status: 200, msg });        
        res.redirect("/listado-ctm-planes-generales");




    })


});

app.get("/ctm-areas", auth, (req, res) => {
    res.render("paginas/ctm_areas");
});

app.get("/lista-ctm-areas", auth, (req, res) => {

    modelControlMando.consultar_RegistroAreas().then(lista_areas => {
        //console.log(lista_planes);
        res.render("paginas/lista_ctm_areas", { lista_areas: lista_areas });
    });


});

app.post("/persistir-plan", auth, (req, res) => {
    //res.send("OK");
    console.log(req.query);
    console.log(req.params);
    modelControlMando.insertar_PlanGeneral(req.query.nombre_plan, req.query.fecha_inicial, req.query.fecha_fin, req.query.activo).then(respuesta => {

        if (respuesta['command'] == "INSERT" && respuesta['rowCount'] > 0) {
            console.log("OK... insert NEW entidad");
            //console.log(listaArchivos);    
            //req.flash('notify', 'La carga de los Planos se realizo con exito...');
            //res.setHeader('Content-type', 'text/html');
            //req.flash('notify', 'La entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' se creó correctamente...');
            res.json({ status: 200, msg: 'El plan General ' + req.query.nombre_plan + ', se creó correctamente...' });
        } else {

            //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' intente de nuevo...');
            res.json({ status: 300, msg: 'ERROR al crear el plan General' + req.query.nombre_plan + ', intente de nuevo...' });
        }

    }).catch(err => {
        console.log(err);
        //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' Ya existe...');
        res.json({ status: 500, msg: 'ERROR!! al almacenar el plan General ' + req.query.nombre_plan + 'Ocurrio un problema' });
    });

})

app.get("/ctm-lineasAccion", auth, (req, res) => {

    modelControlMando.consultar_RegistrosPlan_General().then(lista_planes => {
        //console.log(lista_planes);
        res.render("paginas/lineasAccion", { user: req.session.user, listaPlanes_grales: lista_planes });
    });


});


app.get("/eliminar-popup-linea-accion/:id_linea/control-mando-bips", auth, (req, res) => {
    // console.log(req.query);
    //console.log(req.params);
    //var name = req.query.;    

    let params = [req.params.id_linea, req.query.nombre_linea];
    res.render(path.join(__dirname + "/src/vista/paginas/popup-eliminar-linea-accion"), { datos_linea: params });
});

app.post('/linea-accion/delete/:id/control-mando-bips', auth, function(req, res) {

    console.log(req.query);
    console.log(req.params);
    var msg = '';

    modelControlMando.eliminar_RegistroLineaAccion(req.params.id).then(respuesta => {

        if (respuesta['command'] == "DELETE" && respuesta['rowCount'] > 0) {
            console.log("respuesta de eliminacion: 1, Se elimino correctamente linea de accion...");
            msg = 'La linea de acción ' + req.query.nombre_linea + ' se eliminó correctamente...';
        } else {
            console.log("respuesta de eliminacion: ERROR... 0, ocurrio un problema al eliminar la linea de acción " + req.query.nombre_linea);
            msg = ' ocurrio un problema al eliminar la linea de acción... ' + req.query.nombre_linea;
        }
        req.flash('notify_del_lineaAccion', msg);
        res.redirect("/listado-ctm-lineas-accion");


    })


});

///listado-ctm-lineas-accion
app.get("/listado-ctm-lineas-accion", auth, (req, res) => {

    modelControlMando.consultar_RegistrosLineasAccion().then(lista_lineas_accion => {
        //console.log(lista_planes);
        res.render("paginas/lista_lineasAccion", { lista_lineas_accion: lista_lineas_accion });
    });


});

app.post("/persistir-lineaAccion/", auth, (req, res) => {
    //res.send("OK");
    //console.log(req.query);
    //console.log(req.params);    

    modelControlMando.insertar_lineaAccion(req.query.linea_accion, req.query.plan_general).then(respuesta => {

        if (respuesta['command'] == "INSERT" && respuesta['rowCount'] > 0) {
            console.log("OK... insert NEW entidad");
            //console.log(listaArchivos);    
            //req.flash('notify', 'La carga de los Planos se realizo con exito...');
            //res.setHeader('Content-type', 'text/html');
            //req.flash('notify', 'La entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' se creó correctamente...');
            res.json({ status: 200, msg: 'La linea de Acción ' + req.query.linea_accion + ', se creó correctamente...' });
        } else {

            //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' intente de nuevo...');
            res.json({ status: 300, msg: 'ERROR al crear la linea de Acción' + req.query.linea_accion + ', intente de nuevo...' });
        }

    }).catch(err => {
        console.log(err);
        //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' Ya existe...');
        res.json({ status: 500, msg: 'ERROR!! Ocurrio un problema al crear la linea de acción, contacte con el soporte...' });
    });






})

//form-editar-ctm-linea-accion/?id_linea=

app.post("/form-editar-ctm-linea-accion", auth, (req, res) => {

    //res.send('OK');

    //consultar_RegistrosPlan_General_x_id
    modelControlMando.consultar_RegistrosPlan_General().then(listaPlanes_grales => {

        //console.log(lista_planes);
        modelControlMando.consultar_LineasAccionXId(req.query.id_linea).then(info_linea => {
            res.render("paginas/editar_lineaAccion", { id_linea: req.query.id_linea, info_linea: info_linea, planes_generales: listaPlanes_grales });

        });
        //res.render("paginas/ctm_objetivos", { user: req.session.user, listaPlanes_grales: listaPlanes_grales });

    });




});

app.post("/actualizar-linea-accion", auth, (req, res) => {
    //res.send("OK");
    console.log(req.query);
    console.log(req.params);
    console.log(req.body);
    modelControlMando.actualizar_RegistroLineaAccion_x_id(req.query.id_linea, req.query.linea_accion, req.query.id_plangeneral).then(respuesta => {
        console.log(respuesta);
        if (respuesta['command'] == "UPDATE" && respuesta['rowCount'] > 0) {
            console.log("OK... update linea accion");
            //console.log(listaArchivos);    
            //req.flash('notify', 'La carga de los Planos se realizo con exito...');
            //res.setHeader('Content-type', 'text/html');
            //req.flash('notify', 'La linea de acción' + req.query.linea_accion + ',' + ' se actualizo correctamente...');

            res.send({ status: 200, msg: 'La linea de acción ' + req.query.linea_accion + ', fue actualizada correctamente...' });
            //res.render("/config-entidades");

        } else {

            //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' intente de nuevo...');
            res.send({ status: 300, msg: 'ERROR al actualizar la linea de acción ' + req.query.linea_accion + ' intente de nuevo...' });
        }

    }).catch(err => {
        console.log(err);
        //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' Ya existe...');
        res.json({ status: 500, msg: 'ERROR!! La linea de acción ' + req.query.linea_accion + ', ' + +'NO se pudo actualizar, consulte a soporte...' });
    });

})


app.post("/persistir-objetivo/", auth, (req, res) => {
    //res.send("OK");
    //console.log(req.query);
    //console.log(req.params);

    modelControlMando.insertar_Objetivo(req.query.objetivo, req.query.linea_accion).then(respuesta => {

        if (respuesta['command'] == "INSERT" && respuesta['rowCount'] > 0) {
            console.log("OK... insert NEW entidad");
            //console.log(listaArchivos);    
            //req.flash('notify', 'La carga de los Planos se realizo con exito...');
            //res.setHeader('Content-type', 'text/html');
            //req.flash('notify', 'La entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' se creó correctamente...');
            res.json({ status: 200, msg: 'El objetivo ' + req.query.objetivo + ', se creó correctamente...' });
        } else {

            //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' intente de nuevo...');
            res.json({ status: 300, msg: 'ERROR al crear el Objetivo ' + req.query.objetivo + ', intente de nuevo...' });
        }

    }).catch(err => {
        console.log(err);
        //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' Ya existe...');
        res.json({ status: 500, msg: 'ERROR!! Al crear el objetivo ' + req.query.objetivo + 'consulte con el administrador ...' });
    });






})

app.get("/ctm-objetivos", auth, (req, res) => {

    modelControlMando.consultar_RegistrosPlan_General().then(listaPlanes_grales => {

        //console.log(lista_planes);
        res.render("paginas/ctm_objetivos", { user: req.session.user, listaPlanes_grales: listaPlanes_grales });

    });

});

app.get("/eliminar-popup-objetivo/:id_objetivo/control-mando-bips", auth, (req, res) => {
    // console.log(req.query);
    //console.log(req.params);
    //var name = req.query.;    

    let params = [req.params.id_objetivo, req.query.nombre_objetivo];
    res.render(path.join(__dirname + "/src/vista/paginas/popup-eliminar-objetivo"), { datos_objetivo: params });
});


app.post('/objetivo/delete/:id/control-mando-bips', auth, function(req, res) {

    console.log(req.query);
    console.log(req.params);
    var msg = '';

    modelControlMando.eliminar_RegistroObjetivo(req.params.id).then(respuesta => {

        if (respuesta['command'] == "DELETE" && respuesta['rowCount'] > 0) {
            console.log("respuesta de eliminacion: 1, Se elimino correctamenteel objetivo...");
            msg = 'El objetivo ' + req.query.nombre_objetivo + ' se eliminó correctamente...';
        } else {
            console.log("respuesta de eliminacion: ERROR... 0, ocurrio un problema al eliminar El objetivo " + req.query.nombre_objetivo);
            msg = ' ocurrio un problema al eliminar El objetivo... ' + req.query.nombre_objetivo;
        }
        req.flash('notify_del_objetivo', msg);
        res.redirect("/listado-ctm-objetivos");


    })


});

app.get("/listado-ctm-objetivos", auth, (req, res) => {

    modelControlMando.consultar_RegistrosObjetivos().then(lista_objetivos => {
        //console.log(lista_planes);
        res.render("paginas/lista_ctm_objetivos", { lista_objetivos: lista_objetivos });
    });

});



app.get("/consultar-lineas-accion_x_plan_general", auth, (req, res) => {

    //  console.log(req.query);
    //console.log(req.params);
    //console.log(req.body);

    modelControlMando.consultar_LineasAccionXplangral(req.query.id_plan_gral).then(lista_lineas_accion => {
        //console.log(lista_planes);
        //res.render("paginas/ctm_objetivos", { user: req.session.user,listaPlanes_grales: listaPlanes_grales, lista_lineas_accion: lista_lineas_accion });
        res.send(lista_lineas_accion);

    });

});

app.post("/form-editar-ctm-plan-accion", auth, (req, res) => {

    console.log('id_plan:' + req.query.id_plan);
    modelControlMando.consultar_plan_accion_x_id(req.query.id_plan).then(plan_accion_info => {
        modelControlMando.consultar_RegistrosPlan_General().then(listaPlanes_grales => {
            modelControlMando.consultar_RegistrosLineasAccion().then(lineas_accion => {

                res.render("paginas/editar_plan_accion", { id_plan: req.query.id_plan, planes_generales: listaPlanes_grales, plan_accion_info: plan_accion_info, lineas_accion: lineas_accion });
            });
        });
    });
});

app.post("/form-editar-ctm-indicador", auth, (req, res) => {

    console.log('id_indicador:' + req.query.id_indicador);
    //console.log('id_area:' + req.query.id_area);
    modelControlMando.consultar_indicadores_x_id(req.query.id_indicador).then(indicador_info => {
        modelControlMando.consultar_RegistrosPlan_General().then(listaPlanes_grales => {
            modelControlMando.consultar_RegistrosLineasAccion().then(lineas_accion => {
                modelControlMando.consultar_RegistroPlanes().then(lista_plan_accion => {
                    res.render("paginas/editar_indicador", {
                        id_indicador: req.query.id_indicador,
                        id_plan_accion: req.query.id_plan,
                        planes_generales: listaPlanes_grales,
                        indicador_info: indicador_info,
                        lineas_accion: lineas_accion,
                        lista_plan_accion: lista_plan_accion
                    });
                });
            });
        });
    });
});

app.get("/consultar-areaxid", auth, (req, res) => {
    modelControlMando.consultar_areaxid(req.query.id_area).then(lista_areas => {
        console.log(lista_areas);
        res.send(lista_areas);
    });
});

app.get("/consultar-objetivo-x-lineas-accion", auth, (req, res) => {
    modelControlMando.consultar_ObjetivosXlinea(req.query.id_linea_accion).then(lista_objetivos => {
        res.send(lista_objetivos);

    });

});

app.get("/consultar-estrategia-x-objetivo", auth, (req, res) => {

    //console.log(req.query);
    //console.log(req.params);
    //console.log(req.body);

    modelControlMando.consultar_EstartegiasXobetivo(req.query.id_objetivo).then(lista_Estrategias => {
        //console.log(lista_planes);
        //res.render("paginas/ctm_objetivos", { user: req.session.user,listaPlanes_grales: listaPlanes_grales, lista_lineas_accion: lista_lineas_accion });
        res.send(lista_Estrategias);

    });

});


app.get("/consultar-plan-accion-x-estrategia", auth, (req, res) => {

    //console.log(req.query);
    //console.log(req.params);
    //console.log(req.body);

    modelControlMando.consultar_PlanesXestrategia(req.query.id_estrategia).then(lista_Planes => {
        //console.log(lista_planes);
        //res.render("paginas/ctm_objetivos", { user: req.session.user,listaPlanes_grales: listaPlanes_grales, lista_lineas_accion: lista_lineas_accion });
        res.send(lista_Planes);

    });

});



app.post("/form-editar-ctm-objetivo", auth, (req, res) => {

    //res.send('OK');

    //consultar_RegistrosPlan_General_x_id

    modelControlMando.consultar_RegistroObjetivos_x_id(req.query.id_objetivo).then(objetivo_info => {

        modelControlMando.consultar_RegistrosPlan_General().then(listaPlanes_grales => {

            //console.log(lista_planes);

            modelControlMando.consultar_RegistrosLineasAccion().then(lineas_accion => {


                res.render("paginas/editar_objetivo", { id_objetivo: req.query.id_objetivo, planes_generales: listaPlanes_grales, objetivo_info: objetivo_info, lineas_accion: lineas_accion });
                //res.render("paginas/ctm_objetivos", { user: req.session.user, listaPlanes_grales: listaPlanes_grales });

            });
        });

    });




});

app.post("/actualizar-objetivo", auth, (req, res) => {
    //res.send("OK");
    console.log(req.query);
    console.log(req.params);
    console.log(req.body);
    modelControlMando.actualizar_RegistroObjetivo_x_id(req.query.id_objetivo, req.query.id_linea_accion, req.query.objetivo).then(respuesta => {
        console.log(respuesta);
        if (respuesta['command'] == "UPDATE" && respuesta['rowCount'] > 0) {
            console.log("OK... update plan general");
            //console.log(listaArchivos);    
            //req.flash('notify', 'La carga de los Planos se realizo con exito...');
            //res.setHeader('Content-type', 'text/html');
            //req.flash('notify', 'La linea de acción' + req.query.linea_accion + ',' + ' se actualizo correctamente...');

            res.send({ status: 200, msg: 'El objetivo ' + req.query.objetivo + ' fue actualizado correctamente...' });
            //res.render("/config-entidades");

        } else {

            //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' intente de nuevo...');
            res.send({ status: 300, msg: 'ERROR al actualizar el objetivo <b>' + req.query.objetivo + '</b> ' + ' intente de nuevo...' });
        }

    }).catch(err => {
        console.log(err);
        //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' Ya existe...');
        res.json({ status: 500, msg: 'ERROR!! El objetivo  <b>' + req.query.objetivo + '</b>, ' + +'NO se pudo actualizar...' });
    });

})



app.get("/ctm-estrategias", auth, (req, res) => {
    //console.log(req.query.linea_accion);
    modelControlMando.consultar_RegistrosPlan_General().then(listaPlanes_grales => {

        //console.log(lista_planes);
        res.render("paginas/ctm_estrategias", { user: req.session.user, listaPlanes_grales: listaPlanes_grales });

    });


});

app.get("/listado-ctm-estrategias", auth, (req, res) => {

    modelControlMando.consultar_RegistrosEstrategias().then(lista_Estrategias => {
        //console.log(lista_planes);
        res.render("paginas/lista_ctm_estrategias", { lista_Estrategias: lista_Estrategias });
    });


});

app.post("/actualizar-plan-accion", auth, (req, res) => {


    modelControlMando.actualizar_plan_accion_x_id(req.query.id_plan, req.query.plan, req.query.id_estrategia).then(respuesta => {
        console.log(respuesta);
        if (respuesta['command'] == "UPDATE" && respuesta['rowCount'] > 0) {
            console.log("OK... update plan de accion");
            res.send({ status: 200, msg: 'El plan de accion ' + req.query.plan + ' fue actualizado correctamente...' });
        } else {
            res.send({ status: 300, msg: 'ERROR al actualizar el plan de accion <b>' + req.query.plan + '</b> ' + ' intente de nuevo...' });
        }

    }).catch(err => {
        console.log(err);
        //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' Ya existe...');
        res.json({ status: 500, msg: 'ERROR!! El plan de accion  <b>' + req.query.plan + '</b>, ' + +'NO se pudo actualizar...' });
    });

})


app.post("/form-editar-ctm-estrategia", auth, (req, res) => {
    modelControlMando.consultar_RegistroEstrategia_x_id(req.query.id_estrategia).then(estrategia_info => {
        modelControlMando.consultar_RegistrosPlan_General().then(listaPlanes_grales => {
            modelControlMando.consultar_RegistrosLineasAccion().then(lineas_accion => {
                modelControlMando.consultar_RegistrosObjetivos().then(lista_objetivos => {
                    res.render("paginas/editar_estrategia", {
                        id_estrategia: req.query.id_estrategia,
                        planes_generales: listaPlanes_grales,
                        estrategia_info: estrategia_info,
                        lineas_accion: lineas_accion,
                        lista_objetivos: lista_objetivos
                    });
                    //res.render("paginas/ctm_objetivos", { user: req.session.user, listaPlanes_grales: listaPlanes_grales });
                });
            });
        });
    });
});

app.post("/actualizar-indicador", auth, (req, res) => {

    modelControlMando.actualizar_indicador(req.query.id_indicador, req.query.nombre_indicador, req.query.id_plan_accion, req.query.id_area,
        req.query.tipo_meta, req.query.formula_literal_descriptiva, req.query.meta_descriptiva, req.query.meta_numerica,
        req.query.formula_literal_numerador, req.query.formula_literal_denominador, Number(req.query.periodo_evaluacion)).then(respuesta => {
        console.log(respuesta);
        if (respuesta['command'] == "UPDATE" && respuesta['rowCount'] > 0) {
            console.log("OK... update indicador");
            res.send({ status: 200, msg: 'El indicador ' + req.query.nombre_indicador + ' fue actualizado correctamente...' });
        } else {
            res.send({ status: 300, msg: 'ERROR al actualizar el indicador <b>' + req.query.nombre_indicador + '</b> ' + ' intente de nuevo...' });
        }

    }).catch(err => {
        console.log(err);
        //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' Ya existe...');
        res.json({ status: 500, msg: 'ERROR!! El indicador ' + req.query.nombre_indicador + 'NO se pudo actualizar...' });
    });

})

app.post("/actualizar-estrategia", auth, (req, res) => {
    //res.send("OK");
    console.log(req.query);
    console.log(req.params);
    console.log(req.body);
    modelControlMando.actualizar_RegistroEstrategia_x_id(req.query.id_estrategia, req.query.id_objetivo, req.query.estrategia).then(respuesta => {
        console.log(respuesta);
        if (respuesta['command'] == "UPDATE" && respuesta['rowCount'] > 0) {
            console.log("OK... update Estrategia OK");
            //console.log(listaArchivos);    
            //req.flash('notify', 'La carga de los Planos se realizo con exito...');
            //res.setHeader('Content-type', 'text/html');
            //req.flash('notify', 'La linea de acción' + req.query.linea_accion + ',' + ' se actualizo correctamente...');

            res.send({ status: 200, msg: 'La Estrategia ' + req.query.estrategia + ' fue actualizada correctamente...' });
            //res.render("/config-entidades");

        } else {

            //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' intente de nuevo...');
            res.send({ status: 300, msg: 'ERROR al actualizar La Estrategia ' + req.query.estrategia + ' intente de nuevo...' });
        }

    }).catch(err => {
        console.log(err);
        //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' Ya existe...');
        res.json({ status: 500, msg: 'ERROR!! La Estrategia ' + req.query.estrategia + ' NO se pudo actualizar...' });
    });

})


///eliminar-popup-estrategia/

app.get("/eliminar-popup-estrategia/:id_estrategia/control-mando-bips", auth, (req, res) => {
    // console.log(req.query);
    //console.log(req.params);
    //var name = req.query.;    

    let params = [req.params.id_estrategia, req.query.nombre_estrategia];
    res.render(path.join(__dirname + "/src/vista/paginas/popup-eliminar-estrategia"), { datos_estrategia: params });
});


app.post('/estrategia/delete/:id/control-mando-bips', auth, function(req, res) {

    console.log(req.query);
    console.log(req.params);
    var msg = '';

    modelControlMando.eliminar_RegistroEstrategia(req.params.id).then(respuesta => {

        if (respuesta['command'] == "DELETE" && respuesta['rowCount'] > 0) {
            console.log("respuesta de eliminacion: 1, Se elimino correctamente la estrategia...");
            msg = 'La estrategia ' + req.query.nombre_estrategia + ' se eliminó correctamente...';
        } else {
            console.log("respuesta de eliminacion: ERROR... 0, ocurrio un problema al eliminar La estrategia " + req.query.nombre_estrategia);
            msg = ' ocurrio un problema al eliminar la Estrategia... ' + req.query.nombre_estrategia;
        }
        req.flash('notify_del_estrategia', msg);
        res.redirect("/listado-ctm-estrategias");


    })


});

app.get("/ctm-planes", auth, (req, res) => {
    modelControlMando.consultar_RegistrosPlan_General().then(listaPlanes_grales => {
        res.render("paginas/ctm_planes", { user: req.session.user, listaPlanes_grales: listaPlanes_grales });
    });
});

app.get("/listado-ctm-planes", auth, (req, res) => {
    modelControlMando.consultar_RegistroPlanes().then(lista_Planes => {
        res.render("paginas/lista_ctm_planes", { lista_Planes: lista_Planes });
    });
});

app.get("/eliminar-popup-plan-accion/:id_plan_accion/control-mando-bips", auth, (req, res) => {
    // console.log(req.query);
    //console.log(req.params);
    //var name = req.query.;    

    let params = [req.params.id_plan_accion, req.query.nombre_plan_accion, req.query.id_estrategia];
    res.render(path.join(__dirname + "/src/vista/paginas/popup-eliminar-plan-accion"), { datos_plan: params });
});


app.post('/plan-accion/delete/:id_plan/control-mando-bips', auth, function(req, res) {

    console.log(req.query);
    console.log(req.params.id_estrategia);
    var msg = '';

    modelControlMando.consultar_PlanesXestrategia(req.params.id_estrategia).then(rspta_eliminacion => {

        console.log(rspta_eliminacion);
        if (rspta_eliminacion.length == 0) {

            modelControlMando.eliminar_plan_accion(req.params.id_plan).then(respuesta => {

                msg = 'El plan general ' + req.query.nombre_plan + ' se eliminó correctamente...';
                if (respuesta['command'] == "DELETE" && respuesta['rowCount'] > 0) {
                    console.log("respuesta de eliminacion: 1, Se elimino correctamente el plan de accion...");
                    msg = 'El plan de accion ' + req.query.nombre_plan + ' se eliminó correctamente...';
                } else {
                    console.log("respuesta de eliminacion: ERROR... 0, ocurrio un problema al eliminar el plan general " + req.query.nombre_plan);
                    msg = ' ocurrio un problema al eliminar el plan de accion... ' + req.query.nombre_plan;
                }
            })

        } else {

            msg = 'El plan de accion ' + req.query.nombre_plan + ' NO  se puede Eliminar, tiene asociada una estrategia...';
        }

        req.flash('notify_del_plangral', msg);
        //res.json({ status: 200, msg });        
        res.redirect("/lista-ctm-planes");




    })


});

app.get("/consultar-tipometa-area-x-plan", auth, (req, res) => {
    modelControlMando.consultar_tipometaxidplan(req.query.id_plan).then(lista_tipo_meta => {
        res.send(lista_tipo_meta);
    });
});

app.get("/consultar-periodo-evaluacion-x-id-indicador", auth, (req, res) => {
    modelControlMando.consultar_per_evaluacionxidindicador(req.query.id_indicador).then(lista_periodo_evaluacion => {
        res.send(lista_periodo_evaluacion);
    });
});


app.get("/ctm-indicadores", auth, (req, res) => {

    modelControlMando.consultar_RegistrosPlan_General().then(listaPlanes_grales => {
        modelControlMando.consultar_RegistroAreas().then(lista_areas => {

            res.render("paginas/ctm_indicadores", { user: req.session.user, listaPlanes_grales: listaPlanes_grales, lista_areas: lista_areas });
        });
    });
});

app.get("/ctm-reg-indicadores", auth, (req, res) => {


    modelControlMando.consultar_areaxid(Number(req.session.username['id_area'])).then(lista_area => {

        res.render("paginas/ctm_reg_indicadores", { user: req.session.user, id_profesional: Number(req.session.username['id_profesional']), lista_areas: lista_area, nombre: req.session.username['nombre'] });
    });


});

app.post("/form-editar-ctm-reg-indicador", auth, (req, res) => {

    console.log('id_indicador:' + req.query.id_reg_indicador);
    //console.log('id_area:' + req.query.id_area);
    modelControlMando.consultar_det_reg_ind_evaluacion(req.query.id_reg_indicador).then(indicador_info => {

        res.render("paginas/editar_reg_indicadores", {
            id_reg_indicador: req.query.id_reg_indicador,
            indicador_info: indicador_info
        });
    });

});


app.get("/consultar-vigencia-anio-profesional", auth, (req, res) => {
    //console.log(req.query.año);
    modelControlMando.consultar_vigencia_año(Number(req.query.profesional), Number(req.query.indicador)).then(lista_años => {
        res.send(lista_años);
    });

});

app.get("/ctm-calificacion-indicadores", auth, (req, res) => {

    modelControlMando.consultar_vigenciaxreg_indicadores().then(lista_años => {


        res.render("paginas/ctm_calificacion_indicadores", { user: req.session.user, lista_años: lista_años });
    });


});

app.get("/consultar-periodo-x-anio", auth, (req, res) => {
    //console.log(req.query.año);
    modelControlMando.consultar_periodoxaño(req.query.año, req.query.area, req.query.profesional, req.query.indicador).then(lista_periodo => {
        res.send(lista_periodo);
    });
});

app.get("/consultar-periodo-x-anio-calificacion", auth, (req, res) => {

    modelControlMando.consultar_periodoxaño_calificacion(req.query.año).then(lista_periodo => {
        res.send(lista_periodo);
    });
});


app.get("/consultar-area-x-periodo-calificacion", auth, (req, res) => {
    //console.log('periodo'+req.query.periodo);
    //console.log('vigencia'+req.query.vigencia);

    modelControlMando.consultar_areaxperiodo_calificacion(req.query.periodo, req.query.vigencia).then(lista_area => {
        //console.log('lista_area'+lista_area);
        res.send(lista_area);

    });

});




app.get("/consultar-profesional-x-area", auth, (req, res) => {
    // console.log(req.query.area);
    modelControlMando.consultar_profesionalxarea(req.query.area).then(lista_profesional => {
        res.send(lista_profesional);
    });
});

app.get("/consultar-indicador-x-periodo", auth, (req, res) => {
    //console.log('id_area:' + req.query.area);
    //console.log('VIGENCIA:' + req.query.vigencia);
    //console.log('PERIODO:' + req.query.periodo);


    modelControlMando.consultar_indicadorxperiodo(req.query.area, req.query.vigencia, req.query.periodo).then(lista_indicadores => {
        res.send(lista_indicadores);
    });
});

app.get("/validacion-insert-reg-indicadores", auth, (req, res) => {
    //console.log('id_area:' + req.query.area);
    //console.log('VIGENCIA:' + req.query.vigencia);
    //console.log('PERIODO:' + req.query.periodo);


    modelControlMando.validacion_insert_reg_indicadores(req.query.vigencia, req.query.periodo, req.query.area, req.query.indicador, req.query.profesional).then(validacion => {
        var bandera = false;
        if (validacion.length == 0) {
            //res.send(bandera, validacion);
            res.send({ status: 200, bandera: bandera });
        } else {
            bandera = true;
            //res.send(bandera, validacion);
            console.log(validacion);
            res.send({ status: 200, msg: 'El profesional ya tiene registrado este indicador en este periodo', datos: validacion, bandera: bandera });
        }

    });
});


app.get("/validacion-insert-respuesta-indicadores", auth, (req, res) => {
    //console.log('id_area:' + req.query.area);
    //console.log('VIGENCIA:' + req.query.vigencia);
    //console.log('PERIODO:' + req.query.periodo);


    modelControlMando.validacion_insert_respuesta_indicadores(req.query.vigencia, req.query.periodo, req.query.indicador, req.query.profesional).then(validacion => {
        var bandera = false;
        if (validacion.length == 0) {
            //res.send(bandera, validacion);
            res.send({ status: 200, bandera: bandera });
        } else {
            bandera = true;
            //res.send(bandera, validacion);
            console.log(validacion);
            res.send({ status: 200, msg: 'El profesional ya tiene registrado este indicador en este periodo pendiente por calificar', datos: validacion, bandera: bandera });
        }

    });
});

app.get("/obtener-reg-indicadores_xvigencia_xperiodo_xarea", auth, (req, res) => {
    //console.log('id_area:' + req.query.area);
    //console.log('VIGENCIA:' + req.query.vigencia);
    //console.log('PERIODO:' + req.query.periodo);


    modelControlMando.consultar_indicadorxVigencia_xPeriodo_xarea(req.query.vigencia, req.query.periodo, req.query.area).then(resultados_reg_indicadores => {
        res.send(resultados_reg_indicadores);

    });
});

app.get("/consultar-indicador-x-periodo-area", auth, (req, res) => {

    modelControlMando.consultar_indicadorxperiodo_area(req.query.area, req.query.periodo, req.query.area).then(lista_indicadores => {

        res.send(lista_indicadores);
    });
});

app.get("/consultar-indicador-x-area", auth, (req, res) => {

    modelControlMando.consultar_indicadorxarea(req.query.id_area).then(lista_indicadores => {

        res.send(lista_indicadores);
    });
});

app.get("/consultar-detalle-indicador-x-indicador", auth, (req, res) => {
    //console.log('id_area:' + req.query.area);
    // console.log('id_area:' + req.query.area);
    //console.log('VIGENCIA:' + req.query.vigencia);
    //console.log('PERIODO:' + req.query.periodo);
    console.log('indicador:' + req.query.indicador);
    modelControlMando.consultar_det_indicador(req.query.vigencia, req.query.periodo, req.query.area, req.query.indicador).then(lista_detalle_indicador => {
        res.send(lista_detalle_indicador);
    });
});


app.get("/ctm-indicadores-planes", auth, (req, res) => {

    modelControlMando.consultar_RegistroPlanes().then(lista_planes => {
        //console.log(lista_planes);
        res.render("paginas/ctm_indicadores", { user: req.session.user, lista_planes: lista_planes });
    });

});

app.get("/lista-ctm-indicadores", auth, (req, res) => {

    modelControlMando.consultar_RegistrosIndicadores().then(lista_Indicadores => {
        //console.log(lista_Estrategias);lista_Estrategias
        res.render("paginas/lista_ctm_indicadores", { lista_Indicadores: lista_Indicadores });
    });


});

app.get("/lista-ctm-reg-indicadores", auth, (req, res) => {

    modelControlMando.consultar_reg_indicadores().then(lista_registro_indicadores => {
        //console.log(lista_Estrategias);lista_Estrategias
        res.render("paginas/lista_ctm_reg_indicadores", { lista_registro_indicadores: lista_registro_indicadores });
    });


});
//consultar_reg_indicadores_x_profesional
app.get("/lista_reg_indicadores_x_profesional", auth, (req, res) => {

    modelControlMando.consultar_reg_indicadores_x_profesional(req.query.id_profesional).then(lista_registro_indicadores => {
        //console.log(lista_Estrategias);lista_Estrategias
        res.render("paginas/lista_ctm_reg_indicadores", { lista_registro_indicadores: lista_registro_indicadores });
    });


});

app.get("/lista-ctm-cal-indicadores", auth, (req, res) => {

    modelControlMando.consultar_calificacion_indicadores().then(lista_calificacion_indicadores => {
        //console.log(lista_Estrategias);lista_Estrategias
        res.render("paginas/lista_ctm_calificacion_indicadores", { lista_calificacion_indicadores: lista_calificacion_indicadores });
    });


});

app.get("/lista-ctm-reg-ind-xcal-filtrado", auth, (req, res) => {
    //select a.id_registroindicador, a.vigencia, e.nombre_mes, b.id_indicador, b.nombre_indicador, u.num_identificacion, concat(u.nombre, ' ', u.apellido) as nombre_profesional from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (u.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) where a.vigencia = $1 and e.id_mes = $2 and d.id_area = $3 order by a.id_registroindicador
    //console.log(req.query)
    modelControlMando.consultar_reg_ind_xcal_filtrado(req.query.vigencia, req.query.periodo, req.query.area, req.query.indicador).then(lista_reg_indicadores => {
        //console.log(lista_Estrategias);lista_Estrategias
        //res.setHeader('Content-type', 'text/html');
        //res.send(lista_reg_indicadores);
        res.render("paginas/lista_ctm_ind_xcal_filtrados", { lista_calificacion_indicadores: lista_reg_indicadores });
    });


});

app.get("/lista-ctm-reg-ind-xcal", auth, (req, res) => {
    //select a.id_registroindicador, a.vigencia, e.nombre_mes, b.id_indicador, b.nombre_indicador, u.num_identificacion, concat(u.nombre, ' ', u.apellido) as nombre_profesional from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (u.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) where a.vigencia = $1 and e.id_mes = $2 and d.id_area = $3 order by a.id_registroindicador
    //console.log(req.query)
    modelControlMando.consultar_reg_ind_xcalificar().then(lista_reg_indicadores => {
        //console.log(lista_Estrategias);lista_Estrategias
        //res.setHeader('Content-type', 'text/html');
        //res.send(lista_reg_indicadores);
        res.render("paginas/lista_ctm_ind_xcal_filtrados", { lista_calificacion_indicadores: lista_reg_indicadores });
    });


});

app.get("/obtener_soportesxreg_indicador", auth, (req, res) => {
    //select a.id_registroindicador, a.vigencia, e.nombre_mes, b.id_indicador, b.nombre_indicador, u.num_identificacion, concat(u.nombre, ' ', u.apellido) as nombre_profesional from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (u.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) where a.vigencia = $1 and e.id_mes = $2 and d.id_area = $3 order by a.id_registroindicador
    console.log(req.query)
    modelControlMando.consultar_soportes_x_regIndicador(req.query.id_reg_indicador).then(lista_soportes => {
        console.log(lista_soportes);

        res.render("paginas/lista_ctm_soportes", { lista_soportes: lista_soportes });
    });


});
///descargar-recurso-soporte
app.get("/descargar-recurso-soporte/:id_soporte", auth, (req, res) => {
    //select a.id_registroindicador, a.vigencia, e.nombre_mes, b.id_indicador, b.nombre_indicador, u.num_identificacion, concat(u.nombre, ' ', u.apellido) as nombre_profesional from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (u.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) where a.vigencia = $1 and e.id_mes = $2 and d.id_area = $3 order by a.id_registroindicador
    //console.log(req.query)
    const spawn = require('child_process').spawn;


    modelControlMando.consultar_soporte(req.params.id_soporte).then(lista_soportes => {
        console.log("" + lista_soportes[0].ruta_digital);
        //const spawn_cp = spawn('cmd.exe', ['/c', "C://test.bat"], { shell: true }, { stdio: 'inherit' });
        const spawn_cp = spawn('cmd.exe', ['/c', "C://test.bat", lista_soportes[0].ruta_digital, path.join(__dirname, 'filesBipsUploads')]);

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
                    var file = fs.readFileSync(path.join(__dirname, "/filesBipsUploads/", lista_soportes[0].nombre_soporte), 'binary');

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

app.get("/eliminar-recurso-soporte/:id_soporte", auth, (req, res) => {

    const spawn = require('child_process').spawn;
    modelControlMando.consultar_soporte(req.params.id_soporte).then(lista_soportes => {

        modelControlMando.eliminar_soporte_x_idSoporte(req.params.id_soporte).then(rspta_eliminacion => {



            msg = 'El Soporte ' + lista_soportes[0].nombre_original + ' se eliminó correctamente...';
            if (rspta_eliminacion['command'] == "DELETE" && rspta_eliminacion['rowCount'] > 0) {

                console.log("respuesta de eliminacion: 1, Se elimino correctamente el soporte...");
                msg = 'El Soporte ' + lista_soportes[0].nombre_original + ' se eliminó correctamente...';


                //se elimina el soporte (digital) del directorio                    
                const spawn_del = spawn('cmd.exe', ['/c', "C://task_delete_file.bat", dir_soportes_ctm, lista_soportes[0].nombre_soporte]);


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
                            req.flash('notify_del_soporte', msg);
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


            } else {
                console.log("respuesta de eliminacion: ERROR... 0, ocurrio un problema al eliminar el Soporte " + lista_soportes[0].nombre_original);
                msg = ' ocurrio un problema al eliminar el soporte... ' + lista_soportes[0].nombre_original;
                req.flash('notify_del_soporte', msg);
                res.send({ status: 300 });

            }







        })






    });


});

app.get("/ver-recurso-soporte/:id_soporte", auth, (req, res) => {
    //select a.id_registroindicador, a.vigencia, e.nombre_mes, b.id_indicador, b.nombre_indicador, u.num_identificacion, concat(u.nombre, ' ', u.apellido) as nombre_profesional from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (u.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) where a.vigencia = $1 and e.id_mes = $2 and d.id_area = $3 order by a.id_registroindicador
    //console.log(req.query)
    const spawn = require('child_process').spawn;


    modelControlMando.consultar_soporte(req.params.id_soporte).then(lista_soportes => {
        console.log("" + lista_soportes[0].ruta_digital);
        //const spawn_cp = spawn('cmd.exe', ['/c', "C://test.bat"], { shell: true }, { stdio: 'inherit' });
        const spawn_cp = spawn('cmd.exe', ['/c', "C://test.bat", lista_soportes[0].ruta_digital, path.join(__dirname, '/pdf.js/web/filespublic/')]);



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
                    console.info(preText + "El comando BATCH se ejecuto correctamente, Accion Ver PDF...");

                    res.render("paginas/ctm-iframeViewPDF", { user: req.session.user, file_pdf: lista_soportes[0].nombre_soporte });

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

///form-ctm-calificacion-reg-indicador
app.post("/form-ctm-calificacion-reg-indicador", auth, (req, res) => {

    modelControlMando.consultar_det_reg_ind_xcalificar(req.query.id_reg_indicador).then(lista_reg_indicadores => {
        //console.log(lista_Estrategias);lista_Estrategias
        //console.log(lista_reg_indicadores);
        res.setHeader('Content-type', 'text/html');
        res.render("paginas/detalleCalificacion_reg_indicador", { lista_calificacion_indicadores: lista_reg_indicadores });
    });



});

app.post("/ctm-respuesta-reg-indicador", auth, (req, res) => {

    //res.send('OK');

    //consultar_RegistrosPlan_General_x_id
    console.log('id_reg_in:' + req.query.id_registroindicador);

    modelControlMando.consultar_det_respuesta_indicador(req.query.id_registroindicador).then(lista_detalle_indicador => {



        res.render("paginas/ctm_respuesta_indicadores.ejs", { id_registroindicador: req.query.id_registroindicador, lista_detalle_indicador: lista_detalle_indicador });
        //res.render("paginas/ctm_objetivos", { user: req.session.user, listaPlanes_grales: listaPlanes_grales });




    });




});

//form-ctm-visualizar-reg-indicador/

app.post("/form-ctm-visualizar-reg-indicador", auth, (req, res) => {

    modelControlMando.consultar_det_reg_ind_evaluacion(req.query.id_reg_indicador).then(lista_reg_indicadores => {
        //console.log(lista_Estrategias);lista_Estrategias
        console.log(lista_reg_indicadores);
        res.setHeader('Content-type', 'text/html');
        res.render("paginas/detalleVisualizacion_reg_indicador", { lista_calificacion_indicadores: lista_reg_indicadores });
    });



});

//consultar-calificacion-reg-indicador
app.post("/consultar-calificacion-reg-indicador", auth, (req, res) => {

    modelControlMando.consultar_det_cal_x_regIndicador(req.query.id_reg_indicador).then(calificacion => {
        //console.log(lista_Estrategias);lista_Estrategias
        console.log(calificacion);
        //res.setHeader('Content-type', 'text/html');
        res.send(calificacion);
    });



});

app.get("/obtener_trazabilidad_x_indicador_profesional_vigencia_periodo", auth, (req, res) => {
    //select a.id_registroindicador, a.vigencia, e.nombre_mes, b.id_indicador, b.nombre_indicador, u.num_identificacion, concat(u.nombre, ' ', u.apellido) as nombre_profesional from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (u.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) where a.vigencia = $1 and e.id_mes = $2 and d.id_area = $3 order by a.id_registroindicador
    console.log(req.query)
    modelControlMando.consultar_trazabilidad_reg_indicador(Number(req.query.id_indicador), Number(req.query.profesional), req.query.vigencia, Number(req.query.periodo)).then(lista_trazabilidad => {
        console.log(lista_trazabilidad);
        //res.send(lista_trazabilidad);
        res.render("paginas/lista_ctm_trazabilidad", { lista_trazabilidad: lista_trazabilidad });
    });


});

//persistir-indicador
app.post("/persistir-indicador", auth, (req, res) => {
    //res.send("OK");
    //console.log(req.query);
    //console.log(req.params);

    modelControlMando.insertar_indicador(req.query.nombre_indicador, req.query.plan_accion, req.query.area, req.query.tipo_meta, req.query.formula_descriptiva, req.query.meta_descriptiva, Number(req.query.periodo_evaluacion), req.query.meta_numerica, req.query.formula_literal_num, req.query.form_literal_den).then(respuesta => {

        if (respuesta['command'] == "INSERT" && respuesta['rowCount'] > 0) {
            console.log("OK... insert NEW Indicador");
            //console.log(listaArchivos);    
            //req.flash('notify', 'La carga de los Planos se realizo con exito...');
            //res.setHeader('Content-type', 'text/html');
            //req.flash('notify', 'La entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' se creó correctamente...');
            res.json({ status: 200, msg: 'El Indicador <b>' + req.query.nombre_indicador + '</b>, se creó correctamente...' });
        } else {

            //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' intente de nuevo...');
            res.json({ status: 300, msg: 'ERROR al crear el Indicador <b>' + req.query.nombre_indicador + '</b>, intente de nuevo...' });
        }

    }).catch(err => {
        console.log(err);
        //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' Ya existe...');
        res.json({ status: 500, msg: 'ERROR!! El Indicador <b>' + req.query.nombre_indicador + ' </b> YA EXISTE...' });
    });

})

app.post("/persistir-registro-indicador", auth, upload_soportes.array('files_soporte'), (req, res) => {

    //let fecha_completa = date_.getDate() + "/" + (date_.getMonth() + 1) + "/" + date_.getFullYear();
    let fech_now = Date.now();
    let date_ = new Date(fech_now);

    let fecha_completa_sinSeparador = date_.getDate() + "" + (date_.getMonth() + 1) + "" + date_.getFullYear() + "_";
    let hora = date_.getHours() + "_" + date_.getMinutes() + "_";

    console.log(req.files);


    //console.log("cbxips" + req.body.cbxips);
    //console.log(path_soporte);
    console.log("version:" + Number(req.body.select_version));
    console.log("numerador:" + (req.body.txt_vr_numerador));
    console.log("denominador:" + (req.body.txt_vr_denominador));

    var numerador = parseFloat(req.body.txt_vr_numerador);
    var denominador = parseFloat(req.body.txt_vr_denominador);
    if (req.body.txt_vr_numerador == '') {
        numerador = 0;
    }
    if (req.body.txt_vr_denominador == '') {
        denominador = 0;

    }

    try {
        var version = Number(req.body.select_version);
        if (version == 0) {

            version = 1;

        } else {
            version = version + 1;
        }

        modelControlMando.insertar_registro_indicador(
            Number(req.body.select_indicador),
            Number(req.body.select_profesional),
            req.body.select_vigencia,
            Number(req.body.select_periodo),
            numerador,
            denominador,
            req.body.txt_observacion,
            '0', version).then(respuesta => {

            if (respuesta['command'] == "INSERT" && respuesta['rowCount'] > 0) {
                //console.log(respuesta);
                console.log(respuesta['rows'][0].id_registroindicador);



                console.log(nombre_soporte);

                /*Se debe de obtener el idRegistro Indicador recien insertado para realizar crear la relaciona en BD con el 
                soporte*/
                for (var i in req.files) {

                    //let path_soporte = dir_soportes_ctm + "_" + fecha_completa_sinSeparador + hora + req.files[i].originalname;
                    var ext = path.extname(req.files[i].originalname);

                    var id_registro_indicador = respuesta['rows'][0].id_registroindicador;
                    var nombre_soporte = req.files[i].filename;
                    var path_soporte = req.files[i].path;
                    var es_habilitado = true;
                    var extension = ext;
                    var mime = req.files[i].mimetype;
                    //var fecha_carga = date_;
                    var es_valido = true;
                    var peso = req.files[i].size;
                    var nombre_original = req.files[i].originalname;


                    modelControlMando.insertar_SoporteRegistroIndicador(

                        id_registro_indicador,
                        nombre_soporte,
                        path_soporte,
                        es_habilitado,
                        extension,
                        mime,
                        es_valido,
                        peso,
                        nombre_original

                    ).then(respuesta => {
                        //console.log(respuesta['command'] + " : " + respuesta['rowCount']);
                        if (respuesta['command'] == "INSERT" && respuesta['rowCount'] > 0) {
                            console.log(respuesta);
                            console.log("OK... upload");

                            //num_archivos--;
                            //console.log("archivos insert "+num_archivos);

                        }
                    });

                }
                //console.log("OK... insert NEW Indicador");
                res.json({ status: 200, msg: 'El Registro Indicador , se creó correctamente...' });

            } else {
                res.json({ status: 300, msg: 'ERROR al crear el Registro Indicador , intente de nuevo...' });
            }

        }).catch(err => {
            console.log(err);
            res.json({ status: 500, msg: 'ERROR!! El Registro  Indicador YA EXISTE...' });
        });


        // res.json({ status: 200, msg: 'test ok' });

        //console.log(req.params);
        //console.log(req.files);


    } catch (error) {
        console.log("err " + error);

    }


})

app.get("/eliminar-popup-reg-indicador/:id_reg_indicador/control-mando-bips", auth, (req, res) => {
    // console.log(req.query);
    //console.log(req.params);
    //var name = req.query.;    

    let params = [req.params.id_reg_indicador, req.query.nombre_indicador, req.query.periodo, req.query.vigencia, req.query.version, req.query.id_profesional];
    res.render(path.join(__dirname + "/src/vista/paginas/popup-eliminar-reg-indicador"), { datos_plan: params });
});

app.post('/registro-indicador/delete/:id/control-mando-bips', auth, function(req, res) {

    console.log(req.query);
    console.log(req.params);
    var msg = '';


    //primero se eliminan los soportes asociados al registro de indicador recibido en la peticion
    modelControlMando.eliminar_soporte_x_idRegistroIndicador(req.params.id).then(rspta_eliminacion => {

        console.log(rspta_eliminacion);
        if (rspta_eliminacion['command'] == "DELETE" && rspta_eliminacion['rowCount'] > 0) {
            //eliminar_Registro_RegIndicador
            console.log("Para el registro de indicador: " + req.params.id + " se Eliminaron: " + rspta_eliminacion['rowCount'] + " Soportes q estaban Adjuntos ");
            modelControlMando.eliminar_Registro_RegIndicador(req.params.id).then(respuesta => {

                msg = 'El Registro de indicador para el indicador ' + req.query.nombre_indicador + ' se eliminó correctamente...';
                if (respuesta['command'] == "DELETE" && respuesta['rowCount'] > 0) {
                    console.log("respuesta de eliminacion: 1, Se elimino correctamente el registro de indicador...");
                    msg = 'El Registro de indicador para el indicador ' + req.query.nombre_indicador + ' se eliminó correctamente...';
                } else {
                    console.log("respuesta de eliminacion: ERROR... 0, ocurrio un problema al eliminar el registro de indicador " + req.query.nombre_indicador);
                    msg = ' ocurrio un problema al eliminar el registro de Indicador... ' + req.query.nombre_indicador;
                }


                req.flash('notify_del_reg_indicador', msg);
                res.redirect("/ctm-reg-indicadores");

            })

        }

        //req.flash('notify_del_plangral', msg);
        //res.json({ status: 200, msg: msg });
        //res.json({ status: 200, msg });        





    })


});

app.post("/actualizar-reg-indicador", auth, upload_soportes.array('files_soporte'), (req, res) => {


    console.log(req.body);

    modelControlMando.actualizar_reg_indicador(req.body.id_registroindicador, Number(req.body.txt_vr_numerador), Number(req.body.txt_vr_denominador), req.body.txt_observacion).then(respuesta => {
        console.log(respuesta);
        if (respuesta['command'] == "UPDATE" && respuesta['rowCount'] > 0) {
            console.log("OK... update indicador");

            let fech_now = Date.now();
            let date_ = new Date(fech_now);

            let fecha_completa_sinSeparador = date_.getDate() + "" + (date_.getMonth() + 1) + "" + date_.getFullYear() + "_";
            let hora = date_.getHours() + "_" + date_.getMinutes() + "_";

            console.log(req.files);

            for (var i in req.files) {

                //let path_soporte = dir_soportes_ctm + "_" + fecha_completa_sinSeparador + hora + req.files[i].originalname;

                //console.log("cbxips" + req.body.cbxips);
                console.log(path_soporte);

                try {



                    var ext = path.extname(req.files[i].originalname);

                    var id_registro_indicador = req.body.id_registroindicador;
                    var nombre_soporte = req.files[i].filename;
                    var path_soporte = req.files[i].path;
                    var es_habilitado = true;
                    var extension = ext;
                    var mime = req.files[i].mimetype;
                    var fecha_carga = date_;
                    var es_valido = true;
                    var peso = req.files[i].size;
                    var nombre_original = req.files[i].originalname;

                    console.log(nombre_soporte);

                    /*Se debe de obtener el idRegistro Indicador recien insertado para realizar crear la relaciona en BD con el 
                    soporte*/

                    modelControlMando.insertar_SoporteRegistroIndicador(

                        id_registro_indicador,
                        nombre_soporte,
                        path_soporte,
                        es_habilitado,
                        extension,
                        mime,
                        es_valido,
                        peso,
                        nombre_original

                    ).then(respuesta => {
                        //console.log(respuesta['command'] + " : " + respuesta['rowCount']);
                        if (respuesta['command'] == "INSERT" && respuesta['rowCount'] > 0) {
                            console.log(respuesta);
                            console.log("OK... upload");

                        }
                    });
                    res.json({ status: 200, msg: 'El Registro Indicador , se actualizo correctamente...' });

                } catch (error) {
                    console.log("err " + error);

                }

            }


            res.send({ status: 200, msg: 'El registro del indicador ' + req.body.nombre_indicador + ' fue actualizado correctamente...' });
        } else {
            res.send({ status: 300, msg: 'ERROR al actualizar el registro del indicador <b>' + req.body.nombre_indicador + '</b> ' + ' intente de nuevo...' });
        }

    }).catch(err => {
        console.log(err);
        //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' Ya existe...');
        res.json({ status: 500, msg: 'ERROR!! El regisitro para el indicador ' + req.body.nombre_indicador + 'NO se pudo actualizar...' });
    });

})

app.post("/persistir-calificacion-indicador", auth, (req, res) => {


    modelControlMando.insertar_calificacion_indicador(Number(req.query.reg_indicador), parseFloat(req.query.vr_numerador), parseFloat(req.query.vr_denominador), parseFloat(req.query.resultado_numerico), Number(req.query.resultado_descriptivo), parseFloat(req.query.desviacion), req.query.comentario, Number(req.query.estado)).then(respuesta => {


        if (respuesta['command'] == "INSERT" && respuesta['rowCount'] > 0) {

            //actualizarRegIndicador
            modelControlMando.actualizar_RegIndicador_calificado(req.query.reg_indicador).then(calificado => {

                if (calificado['command'] == "UPDATE" && calificado['rowCount'] > 0) {
                    console.log("OK... insert NEW Indicador, update registro de indicador --> calificado: 1");
                    res.json({ status: 200, msg: 'La Calificación del Indicador se registro correctamente...' });
                } else {
                    console.log("Ocurrio un Error al actualizar la calificacion el registro de Indicador");
                    res.json({ status: 200, msg: 'Ocurrio un Error al actualizar la calificacion el registro de Indicador' });
                }



            });


        } else {
            res.json({ status: 300, msg: 'ERROR al crear al calificar el Indicador, intente de nuevo...' });
        }
    }).catch(err => {
        console.log(err);
        res.json({ status: 500, msg: 'ERROR!! Calificación Indicador YA EXISTE...' });
    });
})



app.post("/persistir-estrategia/", auth, (req, res) => {



    modelControlMando.insertar_estrategia(req.query.estrategia, req.query.objetivo).then(respuesta => {


        if (respuesta['command'] == "INSERT" && respuesta['rowCount'] > 0) {
            console.log("OK... insert NEW");
            res.json({ status: 200, msg: 'La estrategia <b>' + req.query.estrategia + '</b>, se creó correctamente...' });
        } else {

            //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' intente de nuevo...');
            res.json({ status: 300, msg: 'ERROR al crear la estrategia <b>' + req.query.estrategia + '</b>, intente de nuevo...' });
        }

    }).catch(err => {
        console.log(err);
        //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' Ya existe...');
        res.json({ status: 500, msg: 'ERROR!! la estrategia <b>' + req.query.estrategia + ' </b> YA EXISTE...' });
    });



})


app.post("/persistir-area/", auth, (req, res) => {
    modelControlMando.insertar_area(req.query.nombre_area).then(respuesta => {
        if (respuesta['command'] == "INSERT" && respuesta['rowCount'] > 0) {
            console.log("OK... insert NEW");
            res.json({ status: 200, msg: ' el area <b>' + req.query.nombre_area + '</b>, se creó correctamente...' });
        } else {

            //req.flash('error', 'ERROR al crear el area ' + req.query.nombre_area + ', con codigo ' + req.query.id_area + ' intente de nuevo...');
            res.json({ status: 300, msg: 'ERROR al crear  el area <b>' + req.query.nombre_area + '</b>, intente de nuevo...' });
        }

    }).catch(err => {
        console.log(err);
        //req.flash('error', 'ERROR al crear el area ' + req.query.nombre_area + ', con codigo ' + req.query.id_area + ' Ya existe...');
        res.json({ status: 500, msg: 'ERROR!!  el area <b>' + req.query.nombre_area + ' </b> YA EXISTE...' });
    });
})


app.post("/persistir-plan-accion/", auth, (req, res) => {



    modelControlMando.insertar_plan(req.query.plan, req.query.estrategia).then(respuesta => {


        if (respuesta['command'] == "INSERT" && respuesta['rowCount'] > 0) {
            console.log("OK... insert NEW");
            res.json({ status: 200, msg: ' el plan <b>' + req.query.plan + '</b>, se creó correctamente...' });
        } else {

            //req.flash('error', 'ERROR al crear el plan ' + req.query.plan + ', con codigo ' + req.query.cod_entidad + ' intente de nuevo...');
            res.json({ status: 300, msg: 'ERROR al crear  el plan <b>' + req.query.plan + '</b>, intente de nuevo...' });
        }

    }).catch(err => {
        console.log(err);
        //req.flash('error', 'ERROR al crear el plan ' + req.query.plan + ', con codigo ' + req.query.cod_entidad + ' Ya existe...');
        res.json({ status: 500, msg: 'ERROR!!  el plan <b>' + req.query.plan + ' </b> YA EXISTE...' });
    });



})

//ctm-profesionales

app.get("/ctm-profesionales", auth, (req, res) => {


    modelControlMando.consultar_roles().then(lista_roles => {
        modelControlMando.consultar_RegistroAreas().then(lista_areas => {
            //console.log(lista_planes);
            res.render("paginas/ctm_profesionales", { user: req.session.user, lista_areas: lista_areas, lista_roles: lista_roles });
        });
    });


});

app.get("/listado-ctm-profesionales", auth, (req, res) => {

    modelControlMando.consultar_RegistrosProfesionales().then(lista_prof => {
        //console.log(lista_planes);
        res.render("paginas/lista_ctm_profesionales", { lista_prof: lista_prof });
    });


});

app.post("/persistir-profesional/", auth, (req, res) => {
    //res.send("OK");
    console.log(req.query);

    //console.log('2:'+req.query.password_md5);
    
    //console.log(req.params);

    modelControlMando.insertar_Profesional(req.query.rol, req.query.password, req.query.nombre_usuario, req.query.area_trabajo, req.query.nombres, req.query.apellidos, req.query.profesional, req.query.num_identificacion, req.query.tipo_identificacion, req.query.activo, req.query.correo, req.query.telefono).then(respuesta => {

        if (respuesta['command'] == "INSERT" && respuesta['rowCount'] > 0) {
            console.log("OK... insert NEW entidad");
            //console.log(listaArchivos);    
            //req.flash('notify', 'La carga de los Planos se realizo con exito...');
            //res.setHeader('Content-type', 'text/html');
            //req.flash('notify', 'La entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' se creó correctamente...');
            res.json({ status: 200, msg: 'El Profesional <b>' + req.query.nombres + ' ' + req.query.apellidos + '</b>, se creó correctamente...' });
        } else {

            //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' intente de nuevo...');
            res.json({ status: 300, msg: 'ERROR al crear el Profesional <b>' + req.query.nombres + ' ' + req.query.apellidos + '</b>, intente de nuevo...' });
        }

    }).catch(err => {
        console.log(err);
        //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' Ya existe...');
        res.json({ status: 500, msg: 'ERROR!! El Profesional <b>' + req.query.nombres + ' ' + req.query.apellidos + ' </b> YA EXISTE...' });
    });
})

app.get("/calcular-resultado-numerico", auth, (req, res) => {

    //console.log('A:'+req.query.numerador);
    //console.log('B:'+req.query.denominador);

    var valor_resultado_numerico = ((req.query.numerador / req.query.denominador) * 100).toFixed(2);
    // console.log('resultado_num:'+valor_resultado_numerico);
    res.send(valor_resultado_numerico.toString());

});

app.get("/calcular-desviacion", auth, (req, res) => {

    console.log('A:' + req.query.resultado_numerico);
    console.log('B:' + req.query.meta_numerica);

    var valor_desviacion = ((req.query.meta_numerica / req.query.periodo_evaluacion) - req.query.resultado_numerico).toFixed(2);
    console.log('desviacion:' + valor_desviacion);
    res.send(valor_desviacion.toString());

});




///resultados-financieros
app.get("/resultados-financieros", auth, (req, res) => {

    res.render(path.join(__dirname + "/src/vista/paginas/rpt_financiero_contabilidad"), { user: req.session.user, });
});

app.get("/verPDF", auth, (req, res) => {

    //res.render(path.join(__dirname + "/filesBipsUploads/_19102021_13_48_+ == POLIZA GU169464.pdf"), { user: req.session.user, });
    //var ruta = path.join(__dirname, "_19102021_13_48_+ == POLIZA GU169464.pdf");
    //res.render('<iframe src="http://localhost:8888/web/viewer.html?file="' + ruta + "></iframe>");
    res.render("paginas/ctm-iframeViewPDF", { user: req.session.user, });
});



app.listen(3000, () => console.log('El servidor se esta ejecutando...'));
module.exports = app;