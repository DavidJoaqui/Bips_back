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


const app = express();

//app.use(express.urlencoded);
//app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'filesBipsUploads')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'src/vista'));
app.set("view engine", "ejs");

// parse application/json


const storage = multer.diskStorage({
    destination: 'filesBipsUploads/',
    //req ->info peticion, file ->archivo que se sube, cb ->funcion finalizacion
    filename: function (req, file, cb) {
        //cb("",Date.now()+"_"+file.originalname +"." +mimeTypes.extension(file.mimetype));
        const ext = path.extname(file.originalname);
        if (ext !== '.csv') {
            return cb(new Error('Solo se permiten archivos .CSV'));
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

app.get('/obtenerRegistrosPlanos', function (req, res) {
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


app.get('/obtenerIps', function (req, res) {

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

app.get('/validar-registros-ap/:ips', async function (req, res, next) {
    modelbips.validarRegistrosAP(req.params.ips, req.query.fecha_inicial, req.query.fecha_fin).then(validaregistros => {
        const respuesta = validaregistros.rows[0].total_reg;
        console.log(respuesta);
        res.setHeader('Content-type', 'text/javascript');
        res.send(respuesta);
    })
        ;
});

app.get('/cargar', function (req, res) {
    console.log(req);
    res.render("paginas/FormularioCarga");
});


app.post("/files", upload.array('files', 1), (req, res, err) => {


    res.setHeader('Content-type', 'application/json');
    console.log(path.join(__dirname));
    console.log("OK...ruta uploads");
    res.send('{"estado":"200","respuesta": "La operacion se ejecuto con exito.."}');
});

app.get("/listadoArchivos", (req, res) => {

    fs.readdir(path.join(__dirname, 'filesBipsUploads'), (err, files) => {

        const arr_files = new Array();

        if (err) {
            console.log(err);
            res.send('{"estado":"500" ,"respuesta": "Error", "err":"' + err + '"}');
        } else {
            console.log("Los archivos encontrados son: ");
            var hoy = new Date();

            files.forEach(file => {
                arr_files.push(file);
                console.log(file);
            })
            console.log(JSON.stringify(arr_files));
            res.render("paginas/listaArchivos", {
                arr_files: arr_files,
            })
        }
    });


});

app.get('/recursos_marca', function(req, res) {

    res.sendFile(__dirname + "/src/vista/paginas/recursos/marca_final.png");

});


app.post('/file/delete/:name', function(req, res) {

    var name = req.params.name;
    //console.log(req.body.name + " " + req.params.name + " " + req.query.name);
    console.log(name);
    fs.unlink(path.join(__dirname + "/" + 'filesBipsUploads/' + name), (err) => {
        if (err) {
            console.log(err)
            res.send({
                status: 1,
                msg: 'No se pudo borrar el archivo'
            })
        } else {
            res.send({
                status: 0
            })
        }
    })
});


app.get("/reportes", (req, res) => {
    res.render(path.join(__dirname + "/src/vista/paginas/GeneradorReportes"));
  });


app.listen(3000, () => console.log('El servidor se esta ejecutando...'));
module.exports = app;