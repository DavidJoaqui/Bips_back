const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");
const modelControlMando = require("../models/controlMandoModel");

router.get("/ctm-calificacion-indicadores", authMiddleware, (req, res) => {
  modelControlMando
    .consultar_calificacion_indicadores()
    .then((lista_calificacion_indicadores) => {
      res.render(config.rutaPartials + "calificacionIndicador/list", {
        layout:false,
        list: lista_calificacion_indicadores,
      });
    });
});

module.exports = router;
