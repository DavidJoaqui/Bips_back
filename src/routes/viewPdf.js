const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");
const modelControlMando = require("../models/controlMandoModel");

router.get("/pdf/view/soporte/:id",authMiddleware, (req, res) => {
    modelControlMando.consultar_soporte(req.params.id).then(lista_soportes => {
        res.render(config.rutaPartials + "pdf/view", {
            layout: false,                        
            file_pdf: lista_soportes[0].nombre_soporte
          });        

    });
    
  });

  module.exports = router;