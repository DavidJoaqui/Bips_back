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
    modelControlMando.consultar_RegistrosEquivalencia_Vistas().then(lista_equivalencias => {
    res.render(config.rutaPartials + "objetivo/list", {
      layout: false,
      list: lista_objetivos,
      lista_equivalencias:lista_equivalencias,
    });
    });
  });
});

router.get("/objetivos", authMiddleware, (req, res) => {
  modelControlMando.consultar_RegistrosObjetivos().then((lista_objetivos) => {
    modelControlMando.consultar_RegistrosEquivalencia_Vistas().then(lista_equivalencias => {
    res.render(config.rutaPartials + "objetivo/index", {
      user: req.session.username["nombre"],
      nombre_rol: req.session.username["nombre_rol"],
      rol: req.session.username["rol"],
      permisos: req.session.username["permisos"],
      area: req.session.username["nombre_area"],
      list: lista_objetivos,
      lista_equivalencias:lista_equivalencias,
    });
    });
  });
});


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
          return res.status(400).send("Error al guardar datos");
        }
      }).catch((err) => {
        return res.status(500).send("Error al guardar datos");
      });
  }
);


router.get("/form-ctm-objetivo/:id", authMiddleware, (req, res) => {
  modelControlMando
    .consultar_RegistroObjetivos_x_id(req.params.id)
    .then((item) => {
      modelControlMando
        .consultar_RegistrosPlan_General()
        .then((listaPlanes_grales) => {
          modelControlMando
            .consultar_RegistrosLineasAccion()
            .then((lineas_accion) => {
              modelControlMando.consultar_RegistrosEquivalencia_Vistas().then(lista_equivalencias => {
              res.render(config.rutaPartials + "objetivo/form", {
                layout: false,
                id_objetivo:req.params.id,
                planes_generales: listaPlanes_grales,
                item: item,
                lineas_accion: lineas_accion,
                lista_equivalencias:lista_equivalencias,
              });
              });
            });
        });
    });
});

router.put("/actualizar-objetivo", authMiddleware, (req, res) => {
  modelControlMando
    .actualizar_RegistroObjetivo_x_id(
      req.body.id_objetivo,
      req.body.linea_accion,
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