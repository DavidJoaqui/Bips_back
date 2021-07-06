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

//app.use(express.urlencoded);
//app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'filesBipsUploads')));
app.use(express.static(path.join(__dirname, 'src/public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'src/vista'));
app.set("view engine", "ejs");
app.use(session({
    secret: '1d257a7cedc779675860fd92a7ca5baa3b14f7650bdff6612344a730d9a7082b8bfe5b63ab6b4c9aaa55aeb3acdd918a3d736cad21ac4c4e732d18afece369f20711205ee2485cb8ef819313000680c8',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 600000,
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

    res.render(path.join(__dirname + "/src/vista/paginas/GeneradorReportes"), { user: req.session.user, });
});

app.get("/olap-2193", auth, (req, res) => {
    res.render(path.join(__dirname + "/src/vista/paginas/Olap_2193"), { user: req.session.user, });
});

app.post("/eliminar-popup/:name/archivo-bips", auth, (req, res) => {
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
                console.log(user_ok[0].pwd);

                if (user_ok[0].pwd == true) {
                    //console.log("entro en validacion");
                    req.session.user = req.body.username;
                    req.session.admin = true;
                    req.session.web = "http://192.168.1.84:3000";
                    req.session.username = req.body.username;
                    //console.log(req);

                    //console.log(listaArchivos);    
                    //req.flash('notify', 'La carga de los Planos se realizo con exito...');
                    //res.setHeader('Content-type', 'text/html');
                    //res.redirect("/config-entidades");
                    modelEntidad.consultar_registro_entidades().then(listaentidades => {
                            //console.log(listaArchivos);    
                            req.flash('notify', 'Inicio de sesion con exito...');
                            //res.setHeader('Content-type', 'text/html');
                            //res.redirect("/config-entidades");
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

app.get("/form-editar-entidad/:id_ent", auth, (req, res) => {
    //res.send("OK");
    //console.log(req.query);
    //console.log(req.params);

    //Se deben consultar los datos de la entidad con el parametro de entrada cod_ent

    // consultar_registro_entidad_x_id(id_entidad) 
    modelEntidad.consultar_registro_entidad_x_id(req.params.id_ent).then(resultado => {

        console.log(resultado);
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
    //console.log(req.query);
    //console.log(req.params);
    modelEntidad.actualizar_registro_entidades(req.query.cod_entidad, req.query.nombre_entidad, req.query.tipo_reg, req.query.id_ent).then(respuesta => {

        if (respuesta['command'] == "UPDATE" && respuesta['rowCount'] > 0) {
            console.log("OK... update entidad");
            //console.log(listaArchivos);    
            //req.flash('notify', 'La carga de los Planos se realizo con exito...');
            //res.setHeader('Content-type', 'text/html');
            //req.flash('notify', 'La entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' se creó correctamente...');
            res.json({ status: 200, msg: 'La Entidad <b>' + req.query.nombre_entidad + '</b>, con codigo <b>' + req.query.cod_entidad + '</b> fue actualizada correctamente...' });
        } else {

            //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' intente de nuevo...');
            res.json({ status: 300, msg: 'ERROR al actualizar la entidad <b>' + req.query.nombre_entidad + '</b>, con codigo <b>' + req.query.cod_entidad + '</b> intente de nuevo...' });
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
    res.render("paginas/test_header_new");
});




app.listen(3000, () => console.log('El servidor se esta ejecutando...'));
module.exports = app;