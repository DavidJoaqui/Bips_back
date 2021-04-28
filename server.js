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
    secret: 'secret',
    resave: true,
    saveUninitialized: true

}))
app.use(flash());

//declaracion de variables para los modelos 
const modelplanos = require("./models/archivosPlanosModel");
const modelbips = require("./models/modelModel");
const modelvalidaciones = require("./models/validacionModel");
const modelktr = require("./models/ejecucion_KtrModel");
const modelplanos_ = require('./models/archivosPlanosModel');


var num_archivos = 10;

const storage = multer.diskStorage({



    destination: 'filesBipsUploads/',
    //req ->info peticion, file ->archivo que se sube, cb ->funcion finalizacion

    filename: function(req, file, cb) {
        //cb("",Date.now()+"_"+file.originalname +"." +mimeTypes.extension(file.mimetype));


        //console.log("planos 10 - planos bd:"+num_archivos-numplanos);
        var numcarga = req.files.length;
        console.log("numero de archivos a cargar" + numcarga);

        modelplanos.cantidad_RegistrosPlanos_tmp().then(rescount => {
            //count_temp=JSON.stringify(rescount);
            var ext = path.extname(file.originalname);

            var numplanos = Number(Object.values(rescount[0]));
            numplanos = numplanos + numcarga;

            console.log("suma bd + archivos de carga" + numplanos);
            if (numcarga > 10) {
                return cb("Error: Maximo 10 Archivos planos");
            } else if (ext !== '.txt' && ext !== '.Txt') {
                return cb("Error: Solo Archivos Formato .txt");

            } else if (numplanos > 10) {
                return cb("Error: Maximo 10 Archivos planos");
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


        })


        //console.log(req.body);

    }

})

const upload = multer({
    storage: storage
});





const { Console, count } = require('console');
const { send } = require('process');


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//-----------------------------------------------RUTAS--------------------------------------------------------//
//                                                                                                            //
//                                              17/03/2021                                                    //
//                                                                                                            //          
//                                                                                                            //      
////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.get('/', function(req, res) {
    res.redirect('/obtenerRegistrosPlanos');
})

app.get('/obtenerRegistrosPlanos', function(req, res) {
    modelbips.obtenerRegistrosPlanos().then(registroplanos => {

            console.log(registroplanos);

            res.render("paginas/RegistrosPlanos", {
                registroplanos: registroplanos,
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send("Error obteniendo registros");
        });
});


app.get('/cargar-plano', function(req, res) {

    modelbips.obtenerIps().then(listaIps => {

            res.render("paginas/FormularioCarga", {
                listaIps: listaIps,

            });

        })
        .catch(err => {
            console.log(err);
            return res.status(500).send("Error obteniendo registros");
        });
});

app.get('/validar-registros-ap/:ips', async function(req, res, next) {


    modelbips.validarRegistrosAP(req.params.ips, req.query.fecha_inicial, req.query.fecha_fin).then(validaregistros => {
        const respuesta = validaregistros.rows[0].total_reg;
        console.log(respuesta);
        res.setHeader('Content-type', 'text/javascript');
        res.send(respuesta);
    });
});

app.get('/cargar', function(req, res) {
    //console.log(req);
    res.render("paginas/FormularioCarga");
});



app.post("/files", upload.array('files', num_archivos), (req, res, err) => {



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

app.get("/listadoArchivos", (req, res) => {

    var bandera_envio = false;
    var habilitar_carga_bandera = false;
    var habilitar_eliminar_all = false;
    modelplanos.ObtenerPlanos_validos().then(planos_val => {

        modelplanos.validarPlanosNecesarios(planos_val).then(rsta => {

            if (rsta == 1) {
                bandera_envio = true;


            }
        });

    });

    modelplanos.consultar_RegistrosPlanos_tmp().then(planos_all => {
        modelplanos.validarPlanosCargados(planos_all).then(rsta_cargados => {
            //console.log(rsta_cargados);
            if (rsta_cargados == 0) {
                habilitar_carga_bandera = true;
            }

        });

    });

    modelplanos.contar_Planos_Validados().then(conteo_planos => {
        console.log(conteo_planos);
        if (conteo_planos.rows[0].total_validados == 0) {
            habilitar_eliminar_all = true;
        }

    });


    modelplanos.consultar_RegistrosPlanos_tmp().then(listaArchivos => {
            //console.log(listaArchivos);    
            res.setHeader('Content-type', 'text/html');
            res.render("paginas/listaArchivos", {
                arr_files: listaArchivos,
                habilitar_envio_la: bandera_envio,
                habilitar_carga: habilitar_carga_bandera,
                habilitar_eliminar: habilitar_eliminar_all,
            });

        })
        .catch(err => {
            console.log(err);
            return res.status(500).send("Error obteniendo registros");
        });


});

app.get('/recursos_marca', function(req, res) {

    res.sendFile(__dirname + "/src/vista/paginas/recursos/marca_final.png");

});


app.post('/file/delete/:name/archivo-bips', function(req, res) {
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


app.post('/file/validar/:name/archivo-bips', function(req, res) {

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
        if (cont_planos_val.rows[0].total_validados >= 1) {
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
                }

            }).catch(err => {
                console.log(err);
                return res.status(500).send("Error obteniendo registros");
            });



        } else { //si la respuesta de validacion NO esta vacia, se retornan los errores encontrados

            Object.entries(rsta_validacion).forEach(([key, value]) => {

                console.log(`${value}`);
                //console.log(`${value}`); // "a 5", "b 7", "c 9"

            });

            req.flash('error', 'El Archivo Plano ' + nombre_plano + ' tiene los siguientes errores:' + rsta_validacion);
            res.json({ error: 500, respuesta: 'El Archivo Plano ' + nombre_plano + ' tiene los siguientes errores:' + rsta_validacion });
            console.log("cantidad de errores:" + rsta_validacion.length);



            //console.log("select respuesta:"+rsta_validacion);



        }
        //console.log("Archivo validado");
    })

});

app.get("/reportes", (req, res) => {
    res.render(path.join(__dirname + "/src/vista/paginas/GeneradorReportes"));
});

app.post("/eliminar-popup/:name/archivo-bips", (req, res) => {
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

app.post("/delete-all/archivo-bips", (req, res) => {
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

app.post("/enviar-trabajo/ejecucion/archivo-bips", (req, res) => {

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

    const spawn_job = spawn('sh', ['/var/lib/data-integration/kitchen.sh', "-file=/home/bips/Documentos/node-postgresql/src/integracionKjb/Job_reporte2193.kjb", '-level=Basic', '-logfile=/tmp/trans.log']);

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
            modelplanos_.ObtenerPlanos_validos().then(rsta => {

                var cont = rsta.length;

                rsta.forEach(plano => {
                    ruta = plano["path_plano"];
                    var bandera = false;

                    try {
                        //var ruta = path.join(__dirname, 'filesBipsUploads') + '/' + file;
                        fs.unlinkSync(ruta, function(err) {
                            if (err) {
                                bandera = true;
                                return console.error(err);
                            }

                        });

                        if (!bandera) {

                            modelplanos_.eliminar_all_RegistrosPlanos_tmp_validos().then(rsta_elim => {
                                if (rsta_elim['command'] == "DELETE" && rsta_elim['rowCount'] > 0) {
                                    console.log("respuesta de eliminacion: 1, todos los planos fueron eliminados en bd y proyecto");
                                    req.flash('notify', 'informacion fue cargada exitosamente...');
                                    res.json({ respuesta: "OK", status: 200, retorno: code.toString(), descripcion: 'El trabajo se ejecuto con exito... ' });

                                }
                            });
                        }

                    } catch (error) {
                        console.error('Something wrong happened removing the file', error)
                    }

                })




            });





        } else {
            res.status(200).send(code.toString());
            console.error('Ocurrio un problema con la ejecucion del comando/job CODE:' + code);
        }

    });









});

app.post("/enviar-carga/ejecucion-multiple/archivo-bips", (req, res) => {

    //llamado de la transformacion que envia los datos de los archivos planos tmp a las tablas de los planos
    //modelktr.selecionaKtr(name_tmp,nombre_plano);
    //buscar en bd el plano que llega como parametro y obtener el path del plano para pasar a la transformacion,
    //se debe verficar que el plano este validado



    //buscar en bd el plano que llega como parametro y obtener el path del plano para pasar a la transformacion,
    //se debe verficar que el plano este validado



    modelplanos_.ObtenerPlanos_validos().then(rsta => {
        //console.log(rsta);        
        var num_planos = rsta.length;
        console.log("numero incial de planos validados: " + num_planos);
        rsta.forEach(plano => {

            var spawn = require('child_process').spawn;
            if (plano['validado'] == true) {

                var path_plano = plano['path_plano'];
                modelktr.selecionaKtr(plano['nombre_original'].slice(0, 2)).then(nombre_transformacion => {
                    // console.log(rsta_seleccionKtr);
                    //console.log(path_plano);



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
                    let spawn_trs = spawn('sh', ['/var/lib/data-integration/pan.sh', "-file=src/IntegracionKtr/" + nombre_transformacion, '-level=Basic', "-param:ruta_archivo=" + path_plano, '-logfile=/tmp/trans.log']);


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
                        console.log("================   FIN ejecucion de la transforacion      =================");
                        console.log("fecha/hora fin de la ejecucion: ");
                        //console.log(obtener_fecha_hora());
                        console.log("===========================================================================");
                        console.log("resultado de la ejecucion: ");
                        console.log(code)
                            //Se retorna el codigo de estado capturado por el buffer para validar si la transformacion se ejecuto con Exito
                            //OK : 0

                        if (code == 0) {

                            console.log("El comando/transformacion se ejecuto con exito... estado: " + code);


                            modelplanos_.actualizar_carga_temp(plano['id_ips'], plano['nombre_tmp']).then(respuesta => {
                                if (respuesta['command'] == "UPDATE" && respuesta['rowCount'] > 0) {
                                    console.log("actualizo CARGA TEMP OK para el plano ... " + plano['nombre_original']);



                                }

                            });
                            num_planos--;
                            //return 0;      
                            console.log("numero de planos decrementando: " + num_planos);
                            if (num_planos == 0) {



                                modelplanos_.consultar_RegistrosPlanos_tmp().then(listaArchivos => {
                                        //console.log(listaArchivos);    
                                        req.flash('notify', 'La carga de los Planos se realizo con exito...');
                                        //res.setHeader('Content-type', 'text/html');
                                        res.render("paginas/listaArchivos", {
                                            arr_files: listaArchivos,
                                            habilitar_envio_la: true,
                                            habilitar_carga: false,
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


                            }


                        } else {
                            console.error('Ocurrio un problema con la ejecucion del comando/transformacion ' + code);
                            //se retorna el codigo de estado de errro
                            //return 1;
                            req.flash('error', 'Ocurrio un error en la carga del plano ' + plano['nombre_original'] + ' Contacte con el administrador...');
                            res.json({
                                status: 500,
                                retorno: code,
                            });


                        }



                    });

                    spawn_trs.on('exit', (code) => {
                        console.log(`exit child process exited with code ${code}`);
                        //return code;
                    });




                });


            } else {
                console.log("----------------------------------------------------------------------------------------------------");
                console.log("Se omite la ejecucion del comando/transformacion para el archivo: " + plano['nombre_original'] + " NO se encuentra validado...");
                console.log("----------------------------------------------------------------------------------------------------");
                return 1;
            }
        });





    });





});




app.listen(3000, () => console.log('El servidor se esta ejecutando...'));
module.exports = app;