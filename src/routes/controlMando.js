const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");
const modelControlMando = require("../models/controlMandoModel");

router.get("/control-mando", authMiddleware, (req, res) => {

    res.render(config.rutaPaginas + "controlMando", {
      user: req.session.username["nombre"],
      nombre_rol: req.session.username["nombre_rol"],
      rol: req.session.username["rol"],
      permisos: req.session.username["permisos"],
      area: req.session.username["nombre_area"],
    
  });

});


router.get("/control-mando-admin", authMiddleware, (req, res) => {
  modelControlMando.consultar_RegistrosEquivalencia_Vistas().then(lista_equivalencias => {
  res.render(config.rutaPartials + "controlMando/controlMandoAdmin", {
    layout: false,
    permisos: req.session.username['permisos'],
    rol: req.session.username['rol'],
    equivalencia:lista_equivalencias,
  });
  });

});


router.get("/control-mando-user", authMiddleware, (req, res) => {
  res.render(config.rutaPartials + "controlMando/controlMandoUser", {
    layout: false,
    permisos: req.session.username['permisos'],
    rol: req.session.username['rol'],
  });
});


router.get("/validacion-equivalencia", authMiddleware, (req, res) => {
  modelControlMando.consultar_RegistrosEquivalencia_Vistas.then(lista_equivalencias => {
    console.log(lista_equivalencias),
    res.send(lista_equivalencias);
  })
});



module.exports = router;