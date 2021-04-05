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
    secret: 'secret'
}))
app.use(flash());

// parse application/json


const storage = multer.diskStorage({
    destination: 'filesBipsUploads/',
    //req ->info peticion, file ->archivo que se sube, cb ->funcion finalizacion
    filename: function(req, file, cb) {
        //cb("",Date.now()+"_"+file.originalname +"." +mimeTypes.extension(file.mimetype));

        let fech_now = Date.now();

        let date_ = new Date(fech_now);

        let fecha_completa = date_.getDate() + "" + (date_.getMonth() + 1) + "" + date_.getFullYear();
        let hora = date_.getHours() + "" + date_.getMinutes() + "" + date_.getSeconds();

        let fecha_hora = fecha_completa + "_" + hora;

        //console.log(req.body);
        const ext = path.extname(file.originalname);
        if (ext !== '.txt') {
            cb(new Error('Solo se permiten archivos .txt'));
        } else {
            cb("", req.body.cbxips + "_" + fecha_hora + "_" + file.originalname);
        }
    }

})

const upload = multer({
    storage: storage
});


const modelbips = require("./models/modelModel");
const modelplanos = require("./models/archivosPlanosModel");


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
    //var exec = require('shelljs.exec');
    //var sh = require('execSync');

    const execSync = require('child_process').execSync;
    const exec = require('child_process').exec;
    const spawn = require('child_process').spawn;
    /*
    var code = execSync('node -v', { encoding: 'utf8', timeout: 10000 });
    console.log('respuesta comando prueba ' + code);

    var prueba_2 = execSync('cd ' + path.join(__dirname) + ";git describe", { encoding: 'utf8', timeout: 10000, shell: true });
    console.log('la version actual de la aplicacion es: ' + prueba_2);



    //var prueba_3 = spawn('cd /var/lib/data-integration/; sh pan.sh -file="/archivos_bips/Trans_Archivos_Planos/Trans_archivosPlanos.ktr" -level=Error >> /archivos_bips/trans.log;', {encoding: 'utf8', stdio: 'ignore'});
    //const spawn_pr = spawn('sh pan.sh',['-file="/archivos_bips/Trans_Archivos_Planos/Trans_archivosPlanos.ktr']);
    console.log(__dirname);
    //const spawn_pr = spawn('sh',['/var/lib/data-integration/pan.sh','-file=src/IntegracionKtr/Trans_archivosPlanos.ktr','-level=Minimal','logfile=./archivos_bips/trans.log']);
    //const spawn_pr = spawn('ls',['-ltr','/var/lib/data-integration']);
    const spawn_pr = spawn('ls', ['-ltr']);
    spawn_pr.stdout.pipe(process.stdout);
    spawn_pr.stdout.on('data', data => {
        console.log(`stdout:\n${data}`)
    });
    spawn_pr.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    spawn_pr.on('close', (code) => {
        console.log(`child process exited with code ${code}`);

        if (code == '0') {
            console.log("La transformacion se ejecuto con exito... estado: " + code);
        } else {
            console.error('Ocurrio un problema con la ejecucion de la transformacion ' + code);
        }
    });

    */
    //console.log(prueba_3);
    //process.stdout.write('salida'+prueba_3);
    //process.error.write('error'+prueba_3);
    //process.stderr.write('st error'+prueba_3);    




    //const {error , stdout, stderr } = await exec('sh /var/lib/data-integration/kitchen.sh -file="/archivos_bips/Trans_Archivos_Planos/Job_reporte2193.kjb" -level=Nothing >> /archivos_bips/trans.log;', {encoding: 'utf8', timeout: 10000, shell : true});

    //const {error , stdout, stderr } = await exec('node -v', {encoding: 'utf8', timeout: 10000});

    //console.log('error: ', error );
    //console.log('salida: ', stdout );
    //console.log('stderr: ', stderr );

    //var result = sh.exec('node -v');
    //console.log('return code ' + result.code);
    //console.log('stdout + stderr ' + result.stdout);

    modelbips.validarRegistrosAP(req.params.ips, req.query.fecha_inicial, req.query.fecha_fin).then(validaregistros => {
        const respuesta = validaregistros.rows[0].total_reg;
        console.log(respuesta);
        res.setHeader('Content-type', 'text/javascript');
        res.send(respuesta);
    });
});

app.get('/cargar', function(req, res) {
    console.log(req);
    res.render("paginas/FormularioCarga");
});


app.post("/files", upload.array('files', 10), (req, res, err) => {

    console.log(req.files);
    //console.log(req.body);

    let periodo = req.body.txtfecha_inicial + " - " + req.body.txtfecha_fin;

    for (var i in req.files) {

        let fech_now = Date.now();

        let date_ = new Date(fech_now);

        let fecha_completa = date_.getDate() + "/" + (date_.getMonth() + 1) + "/" + date_.getFullYear();
        let hora = date_.getHours() + ":" + date_.getMinutes() + ":" + date_.getSeconds() + ":" + date_.getUTCMilliseconds();

        let fecha_hora = fecha_completa + " " + hora;

        console.log(fecha_hora);

        try {

            modelplanos.insertar_RegistrosPlanos_tmp(req.body.cbxips, req.body.nombre_ips, periodo, req.files[i].originalname, req.files[i].mimetype, fecha_hora, '0', req.body.cbxips + "_" + date_.getDate() + "" + (date_.getMonth() + 1) + "" + date_.getFullYear() + "_" + date_.getHours() + "" + date_.getMinutes() + "" + date_.getSeconds() + "_" + req.files[i].originalname).then(respuesta => {
                //console.log(respuesta['command'] + " : " + respuesta['rowCount']);
                if (respuesta['command'] == "INSERT" && respuesta['rowCount'] > 0) {
                    console.log("OK... upload");

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

    /*fs.readdir(path.join(__dirname, 'filesBipsUploads'), (err, files) => {

        const arr_files = new Array();

        if (err) {
            console.log(err);
            res.send('{"estado":"500" ,"respuesta": "Error", "err":"' + err + '"}');
        } else {
            console.log("Los archivos encontrados son: ");
            files.forEach(file => {
                arr_files.push(file);
                var array_nombre = file.split('.');
                console.log("." + array_nombre[1]);

            });
            res.setHeader('Content-type', 'text/html');
            res.render("paginas/listaArchivos", {
                arr_files: arr_files,
            });
        }
    });*/

    modelplanos.consultar_RegistrosPlanos_tmp().then(listaArchivos => {
            res.setHeader('Content-type', 'text/html');
            res.render("paginas/listaArchivos", {
                arr_files: listaArchivos,

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

    var name = req.params.name;
    console.log(req.query);
    //console.log(name);
    fs.unlink(path.join(__dirname + "/" + 'filesBipsUploads/' + name), (err) => {
        if (err) {
            console.log(err)
            res.send({
                status: 1,
                msg: 'No se pudo borrar el archivo'
            })
        } else {
            //res.status("200").send("OK");
            var array_nombre = name.split('_');
            console.log("nombre_original " + array_nombre[3]);

            modelplanos.eliminar_RegistrosPlanos_tmp(req.query.id_ips, name).then(respuesta => {

                if (respuesta == "")
                    console.log("respuesta de eliminacion: 1");

                console.log("OK elimnado...");

                modelplanos.consultar_RegistrosPlanos_tmp().then(listaArchivos => {

                        req.flash('notify', 'El archivo plano ' + array_nombre[3] + ' se eliminó correctamente...');
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


app.get("/reportes", (req, res) => {
    res.render(path.join(__dirname + "/src/vista/paginas/GeneradorReportes"));
});

app.get("/eliminar-popup", (req, res) => {
    res.render(path.join(__dirname + "/src/vista/paginas/popup-eliminar"));
});

app.listen(3000, () => console.log('El servidor se esta ejecutando...'));
module.exports = app;