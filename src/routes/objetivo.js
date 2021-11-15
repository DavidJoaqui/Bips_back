const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");
const modelControlMando = require("../models/controlMandoModel");


router.post("/persistir-objetivo/", authMiddleware, (req, res) => {
  modelControlMando
    .insertar_Objetivo(req.body.objetivo, req.body.linea_accion)
    .then((respuesta) => {
      if (respuesta["command"] == "INSERT" && respuesta["rowCount"] > 0) {
        return res.status(200).send("Ok");
      } else {
        return res.status(400).send("Error al guardarla entidad");
      }
    })
    .catch((err) => {
      return res.status(500).send("Error al guardar datos");
    });
});


router.get("/ctm-objetivos", authMiddleware, (req, res) => {
  modelControlMando.consultar_RegistrosObjetivos().then((lista_objetivos) => {
    res.render(config.rutaPartials + "objetivo/list", {
      layout: false,
      list: lista_objetivos,
    });
  });
});

router.get(
  "/consultar-lineas-accion_x_plan_general",
  authMiddleware,
  (req, res) => {
    modelControlMando
      .consultar_LineasAccionXplangral(req.query.id_plan_gral)
      .then((lista_lineas_accion) => {
        return res.send(lista_lineas_accion);
      });
  }
);

router.delete(
  "/objetivo/delete/:id/control-mando-bips",
  authMiddleware,
  function (req, res) {
    modelControlMando
      .eliminar_RegistroObjetivo(req.params.id)
      .then((respuesta) => {
        if (respuesta["command"] == "DELETE" && respuesta["rowCount"] > 0) {
          return res.status(200).send("Ok");
        } else {
          return res.status(500).send("Error al guardar datos");
        }
      });
  }
);


router.get("/form-ctm-objetivo/:id", authMiddleware, (req, res) => {
  modelControlMando
    .consultar_RegistroObjetivos_x_id(req.params.id)
    .then((objetivo_info) => {
      modelControlMando
        .consultar_RegistrosPlan_General()
        .then((listaPlanes_grales) => {
          modelControlMando
            .consultar_RegistrosLineasAccion()
            .then((lineas_accion) => {
              res.render(config.rutaPartials + "objetivo/form", {
                layout: false,
                id_objetivo:req.params.id,
                planes_generales: listaPlanes_grales,
                objetivo_info: objetivo_info,
                lineas_accion: lineas_accion,
              });
            });
        });
    });
});

router.post("/actualizar-objetivo", authMiddleware, (req, res) => {;
  modelControlMando
    .actualizar_RegistroObjetivo_x_id(
      req.body.id_objetivo,
      req.body.id_linea_accion,
      req.body.objetivo
    )
    .then((respuesta) => {
      if (respuesta["command"] == "UPDATE" && respuesta["rowCount"] > 0) {
        return res.status(200).send("Ok");
      } else {
        return res.status(400).send("Error al guardarla entidad");
      }
    })
    .catch((err) => {
      return res.status(500).send("Error al guardar datos");
    });
});

module.exports = router;