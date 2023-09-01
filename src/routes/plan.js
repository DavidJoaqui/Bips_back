const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");
const modelControlMando = require("../models/controlMandoModel");

router.get("/ctm-planes", authMiddleware, (req, res) => {
  modelControlMando.consultar_RegistroPlanes().then((lista_Planes) => {
    modelControlMando.consultar_RegistrosEquivalencia_Vistas().then(lista_equivalencias => {
    res.render(config.rutaPartials + "plan/list", {
      layout: false,
      list: lista_Planes,
      lista_equivalencias:lista_equivalencias,
    });
    });
  });
});

router.get("/evidencias", authMiddleware, (req, res) => {
  modelControlMando.consultar_RegistroPlanes().then((lista_Planes) => {
    modelControlMando.consultar_RegistrosEquivalencia_Vistas().then(lista_equivalencias => {
    res.render(config.rutaPartials + "plan/index", {
      user: req.session.username["nombre"],
      nombre_rol: req.session.username["nombre_rol"],
      rol: req.session.username["rol"],
      permisos: req.session.username["permisos"],
      area: req.session.username["nombre_area"],
      list: lista_Planes,
      lista_equivalencias:lista_equivalencias,
    });
    });
  });
});


router.get("/form-ctm-plan/:id", authMiddleware, (req, res) => {
  modelControlMando
    .consultar_plan_accion_x_id(req.params.id)
    .then((plan_accion_info) => {
      modelControlMando
        .consultar_RegistrosPlan_General()
        .then((listaPlanes_grales) => {
          modelControlMando
            .consultar_RegistrosLineasAccion()
            .then((lineas_accion) => {
              modelControlMando.consultar_RegistrosEquivalencia_Vistas().then(lista_equivalencias => {
              res.render(config.rutaPartials + "plan/form", {
                layout:false,
                id_plan: req.params.id,
                planes_generales: listaPlanes_grales,
                item: plan_accion_info,
                lineas_accion: lineas_accion,
                lista_equivalencias:lista_equivalencias,
              });
              });
            });
        });
    });
});

router.post("/persistir-plan", authMiddleware, (req, res) => {
  modelControlMando
    .insertar_plan(req.body.plan, req.body.estrategia)
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

router.put("/actualizar-plan", authMiddleware, (req, res) => {
  modelControlMando
    .actualizar_plan_accion_x_id(
      req.body.id_plan,
      req.body.plan,
      req.body.estrategia
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

router.delete(
  "/plan/delete/:id_plan/control-mando-bips",
  authMiddleware,
  function (req, res) {
    modelControlMando
      .consultar_PlanesXestrategia(req.params.id_estrategia)
      .then((rspta_eliminacion) => {
        if (rspta_eliminacion.length == 0) {
          modelControlMando
            .eliminar_plan_accion(req.params.id_plan)
            .then((respuesta) => {
              if (
                respuesta["command"] == "DELETE" &&
                respuesta["rowCount"] > 0
              ) {
                return res.status(200).send("Ok");
              } else {
                return res.status(400).send("Error al guardarla entidad");
              }
            }).catch((err) => {
                return res.status(500).send("Error al guardar datos");
              });
        } else {
          return res.status(500).send("Error al guardar datos");
        }
      }).catch((err) => {
        return res.status(500).send("Error al guardar datos");
      });
  }
);

module.exports = router;
