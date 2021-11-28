const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");


router.get("/reportes-pentaho/loading", authMiddleware, (req, res) => {
  res.end("No hay reporte asociado");
});

router.get("/reportes-pentaho", authMiddleware, (req, res) => {
  res.render(config.rutaPaginas + "reportePentaho", {
    user: req.session.user,
    area: req.session.username["nombre_area"],
  });
});

router.get("/reportes-pentaho/:area", authMiddleware, (req, res) => {
  res.render(config.rutaPartials + "reportePentaho/view", {
    layout: false,
    area: req.params.area,
  });
});


module.exports = router;
