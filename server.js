
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

app.use(express.json());
//app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'filesBipsUploads')));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, 'vista'));

app.set("view engine", "ejs");

// parse application/json
app.use(bodyParser.json())

const storage = multer.diskStorage({
    destination: 'filesBipsUploads/',
    //req ->info peticion, file ->archivo que se sube, cb ->funcion finalizacion
    filename: function (req, file, cb) {
        //cb("",Date.now()+"_"+file.originalname +"." +mimeTypes.extension(file.mimetype));
        cb("", file.originalname);
    }

})

const upload = multer({
    storage: storage
});


const modelbips = require("./models/modelModel");



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//-----------------------------------------------METODOS------------------------------------------------------//
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

app.get('/validarRegistrosAP/:idips', function (req, res) {
    modelbips.obtenerIps(req.params.idips).then(listaRegIps => {
        if (listaRegIps) res.render("paginas/FormularioCarga", {
            listaRegIps: listaRegIps,
        }); else {
            return res.status(500).send("No existe registros");
        }

    })
        .catch(err => {
            console.log(err);
            return res.status(500).send("Error obteniendo registros");
        });
});



app.get('/cargar', function (req, res) {

    console.log(req);

    res.render("paginas/FormularioCarga");

});


app.post("/files", upload.array('files', 10), (req, res) => {
    res.setHeader('Content-type', 'application/json');
    console.log(__dirname);
    console.log("OK...ruta uploads");  
    res.send('{"estado":"200","respuesta": "OK", "archivos":"pruebas"}');
  });

app.listen(3000, () => console.log('El servidor se esta ejecutando...'));

module.exports = app;
