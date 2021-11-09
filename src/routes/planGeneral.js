const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");
const modelControlMando = require("../models/controlMandoModel");

router.get("/ctm-plan-general", authMiddleware, (req, res) => {
  res.render("paginas/plan_general", {
    nombre_rol: req.session.username["nombre_rol"],
    rol: req.session.username["rol"],
  });
});

router.get("/listado-ctm-planes-generales", authMiddleware, (req, res) => {
  modelControlMando.consultar_RegistrosPlan_General().then((lista_planes) => {
    res.render("paginas/lista_planGral", { lista_planes: lista_planes });
  });
});

/// Form-editar-ctm-plan-general
router.post("/form-editar-ctm-plan-general", authMiddleware, (req, res) => {

  modelControlMando
    .consultar_RegistrosPlan_General_x_id(req.query.id_plan)
    .then((info_plan) => {
      res.render("paginas/editar_planGral", {
        id_plan: req.query.id_plan,
        info_plan: info_plan,
      });
    });
});

//"/actualizar-plan
router.post("/actualizar-plan-general", authMiddleware, (req, res) => {

  modelControlMando
    .actualizar_RegistrosPlan_General_x_id(
      req.query.id_plan,
      req.query.nombre_plan,
      req.query.fecha_inicial,
      req.query.fecha_fin,
      req.query.activo
    )
    .then((respuesta) => {
      console.log(respuesta);
      if (respuesta["command"] == "UPDATE" && respuesta["rowCount"] > 0) {

        res.send({
          status: 200,
          msg:
            "El plan General " +
            req.query.nombre_plan +
            " fue actualizado correctamente...",
        });

      } else {
  
        res.send({
          status: 300,
          msg:
            "ERROR al actualizar el plan general " +
            req.query.nombre_plan +
            " " +
            " intente de nuevo...",
        });
      }
    })
    .catch((err) => {

      res.json({
        status: 500,
        msg:
          "ERROR!! El plan general  " +
          req.query.nombre_plan +
          ", " +
          +"NO se pudo actualizar...",
      });
    });
});

router.get(
  "/eliminar-popup-plan-general/:id_plan/control-mando-bips",
  authMiddleware,
  (req, res) => {


    let params = [req.params.id_plan, req.query.nombre_plan];
    res.render(
      path.join(__dirname + "/src/vista/paginas/popup-eliminar-plangeneral"),
      { datos_plan: params }
    );
  }
);

// Plan-general/delete/

router.post(
  "/plan-general/delete/:id/control-mando-bips",
  authMiddleware,
  function (req, res) {
    var msg = "";

    modelControlMando
      .consultar_LineasAccionXplangral(req.params.id)
      .then((rspta_eliminacion) => {
        console.log(rspta_eliminacion);
        if (rspta_eliminacion.length == 0) {
          modelControlMando
            .eliminar_RegistroPlan_General(req.params.id)
            .then((respuesta) => {
              msg =
                "El plan general " +
                req.query.nombre_plan +
                " se eliminó correctamente...";
              if (
                respuesta["command"] == "DELETE" &&
                respuesta["rowCount"] > 0
              ) {
                console.log(
                  "respuesta de eliminacion: 1, Se elimino correctamente el plan general..."
                );
                msg =
                  "El plan general " +
                  req.query.nombre_plan +
                  " se eliminó correctamente...";
              } else {
                console.log(
                  "respuesta de eliminacion: ERROR... 0, ocurrio un problema al eliminar el plan general " +
                    req.query.nombre_plan
                );
                msg =
                  " ocurrio un problema al eliminar el plan general... " +
                  req.query.nombre_plan;
              }
            });
        } else {
          msg =
            "El plan general " +
            req.query.nombre_plan +
            " NO  se puede Eliminar, tiene asociada una Linea de Acción...";
        }

        req.flash("notify_del_plangral", msg);
        res.redirect("/listado-ctm-planes-generales");
      });
  }
);

module.exports = router;