const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");
const modelControlMando = require("../models/controlMandoModel");




router.get("/ctm-lineas-accion", authMiddleware, (req, res) => {
  modelControlMando.consultar_RegistrosLineasAccion().then(lista_lineas_accion => {
    modelControlMando.consultar_RegistrosEquivalencia_Vistas().then(lista_equivalencias => {
    res.render(config.rutaPartials + "lineaAccion/list", {
       layout: false,
       list: lista_lineas_accion,
       lista_equivalencias:lista_equivalencias,
      });
      });
});
});

router.get("/programas", authMiddleware, (req, res) => {
  modelControlMando.consultar_RegistrosLineasAccion().then(lista_lineas_accion => {
    modelControlMando.consultar_RegistrosEquivalencia_Vistas().then(lista_equivalencias => {
    res.render(config.rutaPartials + "lineaAccion/index", {
       user: req.session.username["nombre"],
       nombre_rol: req.session.username["nombre_rol"],
       rol: req.session.username["rol"],
       permisos: req.session.username["permisos"],
       area: req.session.username["nombre_area"],
       list: lista_lineas_accion,
       lista_equivalencias:lista_equivalencias,
      });
      });
});
});



router.delete(
  "/linea-accion/delete/:id/control-mando-bips",
  authMiddleware,
  function (req, res) {
    modelControlMando
      .eliminar_RegistroLineaAccion(req.params.id)
      .then((respuesta) => {
        if (respuesta["command"] == "DELETE" && respuesta["rowCount"] > 0) {
          return res.status(200).send("Ok");
        } else {
          return res.status(500).send("Error al guardar datos");
        }
      }).catch((err) => {
        return res.status(500).send("Error al guardar datos");
      });
  }
);


router.post("/persistir-linea-accion/", authMiddleware, (req, res) => {
  modelControlMando
    .insertar_lineaAccion(req.body.linea_accion, req.body.plan_general)
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



router.get("/form-ctm-linea-accion/:id", authMiddleware, (req, res) => {
  modelControlMando
    .consultar_RegistrosPlan_General().then((listaPlanes_grales) => {
      modelControlMando.consultar_LineasAccionXId(req.params.id).then((item) => {
        modelControlMando.consultar_RegistrosEquivalencia_Vistas().then(lista_equivalencias => {
        return res.render(config.rutaPartials + "lineaAccion/form", {
            layout: false,
            id_linea: req.params.id,
            item: item,
            planes_generales: listaPlanes_grales,
            lista_equivalencias:lista_equivalencias,
          });
          });
        });
    });
});

router.put("/actualizar-linea-accion", authMiddleware, (req, res) => {
  modelControlMando
    .actualizar_RegistroLineaAccion_x_id(
      req.body.id_linea,
      req.body.linea_accion,
      req.body.plan_general
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