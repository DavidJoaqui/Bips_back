const express = require("express");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const flash = require("express-flash-messages");
const session = require("express-session");
const config = require("./src/config/config");
const app = express();

// Static
app.use(express.static(path.join(__dirname, config.rutaFile)));
app.use(express.static(path.join(__dirname, config.rutaPublic)));
app.use(express.static(config.rutaSoportesCtm));
// Body parse
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Set Templating Engine
app.set("views", path.join(__dirname, config.rutaViews));
app.use(expressLayouts);
app.set("layout", "./layouts/dashboard");
app.set("view engine", "ejs");
// Session
app.use(
  session({
    secret: config.sesionSecret,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 6000000,
    },
  })
);
app.use(flash());

// Rutas
[
  require("./src/routes/login"),
  require("./src/routes/otros"),
  require("./src/routes/olap2193"),
  require("./src/routes/reporte2193"),
  require("./src/routes/configEntidades"),
  require("./src/routes/controlMando"),
  require("./src/routes/planGeneral"),
  require("./src/routes/permiso"),
  require("./src/routes/profesional"),
  require("./src/routes/indicador"),
  require("./src/routes/filePlano"),
].forEach((route) => {
  app.use(route);
});

// Init servidor
app.listen(config.port, () =>
  console.log("El servidor se esta ejecutando..." + config.port)
);
module.exports = app;
