const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");
const modelControlMando = require("../models/controlMandoModel");


router.get("/ctm-plan-general", authMiddleware, (req, res) => {
  modelControlMando.consultar_RegistrosPlan_General().then((lista_planes) => {
    modelControlMando.consultar_RegistrosEquivalencia_Vistas().then(lista_equivalencias => {
    res.render(config.rutaPartials + "planGeneral/list", { 
      layout: false,
      list: lista_planes,
      lista_equivalencias:lista_equivalencias,
      });
    });
  });
});


router.get("/politicas", authMiddleware, (req, res) => {
  modelControlMando.consultar_RegistrosPlan_General().then((lista_planes) => {
    modelControlMando.consultar_RegistrosEquivalencia_Vistas().then(lista_equivalencias => {
    res.render(config.rutaPartials + "planGeneral/index", { 
      user: req.session.username["nombre"],
      nombre_rol: req.session.username["nombre_rol"],
      rol: req.session.username["rol"],
      permisos: req.session.username["permisos"],
      area: req.session.username["nombre_area"],
      list: lista_planes,
      lista_equivalencias:lista_equivalencias,
      });
    });
  });
});


router.get("/form-ctm-plan-general/:id", authMiddleware, (req, res) => {
  modelControlMando.consultar_RegistrosPlan_General_x_id(req.params.id).then((item) => {
      modelControlMando.consultar_RegistrosEquivalencia_Vistas().then(lista_equivalencias => {
      return res.render(config.rutaPartials + "planGeneral/form", {
        layout: false,
        id_plan: req.params.id,
        item: item,
        lista_equivalencias:lista_equivalencias,
      });
      
    })
  });
});

router.post("/persistir-plan-general", authMiddleware, (req, res) => {
  modelControlMando
    .insertar_PlanGeneral(
      req.body.nombre_plan,
      req.body.fecha_inicial,
      req.body.fecha_fin,
      req.body.activo,
      req.body.meta
    )
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

//"/actualizar-plan
router.put("/actualizar-plan-general", authMiddleware, (req, res) => {

  modelControlMando
    .actualizar_RegistrosPlan_General_x_id(
      req.body.id_plan,
      req.body.nombre_plan,
      req.body.fecha_inicial,
      req.body.fecha_fin,
      req.body.activo,
      req.body.meta
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
  "/plan-general/delete/:id/control-mando-bips",
  authMiddleware,
  function (req, res) {

    modelControlMando
      .consultar_LineasAccionXplangral(req.params.id)
      .then((rspta_eliminacion) => {
        if (rspta_eliminacion.length == 0) {
          modelControlMando
            .eliminar_RegistroPlan_General(req.params.id)
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