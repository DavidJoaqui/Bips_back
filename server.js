
const express = require('express');
//const router = express.Router();
const path = require('path');
const app = express();


app.set('views', path.join(__dirname, 'vista'));
app.set("view engine", "ejs");

const modelbips = require("./models/modelModel");

app.get('/obtenerDatosBips', function (req, res) {
    modelbips.obtener().then(registroplanos => {

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

app.get('/cargar', function (req, res) {
    
            console.log(req);

            res.render("paginas/FormularioCarga");

});


app.listen(3000, () => console.log('El servidor se esta ejecutando...'));

module.exports = app;
