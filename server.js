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
        const ext = path.extname(file.originalname);
        if (ext !== '.txt') {
            return cb(new Error('Solo se permiten archivos .txt'));
        } else {
            cb("", file.originalname);
        }
    }

})

const upload = multer({
    storage: storage
});


const modelbips = require("./models/modelModel");



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//-----------------------------------------------RUTAS--------------------------------------------------------//
//                                                                                                            //
//                                              17/03/2021                                                    //
//                                                                                                            //          
//                                                                                                            //      
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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


app.get('/obtenerIps', function(req, res) {

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

    //se debe registrar en bd los datos de los archivos cargados (periodo,mimetype,ips)

    //console.log(req.body);
    res.setHeader('Content-type', 'application/json');
    console.log(path.join(__dirname));
    console.log("OK...ruta uploads");
    res.send('{"estado":"200","respuesta": "La operacion se ejecuto con exito.."}');
});

app.get("/listadoArchivos", (req, res) => {

    fs.readdir(path.join(__dirname, 'filesBipsUploads'), { withFileTypes: true }, (err, files) => {

        const arr_files = new Array();

        if (err) {
            console.log(err);
            res.send('{"estado":"500" ,"respuesta": "Error", "err":"' + err + '"}');
        } else {
            console.log("Los archivos encontrados son: ");
            var fecha = new Date();
            console.log(fecha);
            files.forEach(file => {
                arr_files.push(file);
                console.log(file);
            })
            res.render("paginas/listaArchivos", {
                arr_files: arr_files,
            })
        }
    });


});

app.get('/recursos_marca', function(req, res) {

    res.sendFile(__dirname + "/src/vista/paginas/recursos/marca_final.png");

});


app.post('/file/delete/:name/archivos-bips', function(req, res) {

    var name = req.params.name;
    //console.log(req.body.name + " " + req.params.name + " " + req.query.name);
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

            fs.readdir(path.join(__dirname, 'filesBipsUploads'), { withFileTypes: true }, (err, files) => {

                const arr_files = new Array();

                if (err) {
                    res.send('{"estado":"500" ,"respuesta": "Error", "err":"' + err + '"}');
                } else {
                    console.log("Los archivos encontrados despues de eliminar son : ");
                    files.forEach(file => {
                        arr_files.push(file);
                        console.log(file);
                    });
                    /*Se debe elimnar tambien el registro de la BD cuando se elimine un archivo plano cargado para determinado periodo de tiempo*/


                    req.flash('notify', 'El archivo plano ' + name + ' se eliminó correctamente...');
                    res.render("paginas/listaArchivos", {
                        arr_files: arr_files,
                    })
                }
            });

        }
    })
});


app.get("/reportes", (req, res) => {
    res.render(path.join(__dirname + "/src/vista/paginas/GeneradorReportes"));
});


app.listen(3000, () => console.log('El servidor se esta ejecutando...'));
module.exports = app;