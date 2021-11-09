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


router.post(
  "/objetivo/delete/:id/control-mando-bips",
  authMiddleware,
  function (req, res) {

    var msg = "";

    modelControlMando
      .eliminar_RegistroObjetivo(req.params.id)
      .then((respuesta) => {
        if (respuesta["command"] == "DELETE" && respuesta["rowCount"] > 0) {
          console.log(
            "respuesta de eliminacion: 1, Se elimino correctamenteel objetivo..."
          );
          msg =
            "El objetivo " +
            req.query.nombre_objetivo +
            " se eliminó correctamente...";
        } else {
          console.log(
            "respuesta de eliminacion: ERROR... 0, ocurrio un problema al eliminar El objetivo " +
              req.query.nombre_objetivo
          );
          msg =
            " ocurrio un problema al eliminar El objetivo... " +
            req.query.nombre_objetivo;
        }
        req.flash("notify_del_objetivo", msg);
        res.redirect("/listado-ctm-objetivos");
      });
  }
);



module.exports = router;