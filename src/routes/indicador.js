const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");
const modelControlMando = require("../models/controlMandoModel");

router.post("/actualizar-indicador", authMiddleware, (req, res) => {
  modelControlMando
    .actualizar_indicador(
      req.body.id_indicador,
      req.body.nombre_indicador,
      req.body.plan_accion,
      req.body.area,
      req.body.tipo_meta,
      req.body.formula_literal_descriptiva,
      req.body.meta_descriptiva,
      req.body.meta_numerica,
      req.body.formula_literal_numerador,
      req.body.formula_literal_denominador,
      Number(req.body.periodo_evaluacion)
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

// Persistir-indicador
router.post("/persistir-indicador", authMiddleware, (req, res) => {
  modelControlMando
    .insertar_indicador(
      req.body.nombre_indicador,
      req.body.plan_accion,
      req.body.area,
      req.body.tipo_meta,
      req.body.formula_descriptiva,
      req.body.meta_descriptiva,
      Number(req.body.periodo_evaluacion),
      req.body.meta_numerica,
      req.body.formula_literal_numerador,
      req.body.formula_literal_denominador
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

router.post(
  "/indicador/delete/:id/control-mando-bips",
  authMiddleware,
  function (req, res) {
    var msg = "";

    //primero se eliminan los soportes asociados al registro de indicador recibido en la peticion
    modelControlMando
      .eliminar_soporte_x_idRegistroIndicador(req.params.id)
      .then((rspta_eliminacion) => {
        if (
          rspta_eliminacion["command"] == "DELETE" &&
          rspta_eliminacion["rowCount"] > 0
        ) {
          modelControlMando
            .eliminar_Registro_RegIndicador(req.params.id)
            .then((respuesta) => {
              msg =
                "El Registro de indicador para el indicador " +
                req.query.nombre_indicador +
                " se eliminó correctamente...";
              if (
                respuesta["command"] == "DELETE" &&
                respuesta["rowCount"] > 0
              ) {
                return res.status(200).send("Ok");
              } else {
                return res.status(500).send("Error al guardar datos");
              }
            });
        }
      });
  }
);

router.get("/form-ctm-indicador/:id", authMiddleware, (req, res) => {
  modelControlMando
    .consultar_indicadores_x_id(req.params.id)
    .then((indicador_info) => {
      modelControlMando
        .consultar_RegistrosPlan_General()
        .then((listaPlanes_grales) => {
          modelControlMando
            .consultar_RegistroAreas()
            .then((lista_areas) => {
              res.render(config.rutaPartials + "indicador/form", {
                layout: false,
                id_indicador: req.params.id,
                planes_generales: listaPlanes_grales,
                item: indicador_info,
                lista_areas: lista_areas,
              });
            });
        });
    });
});

router.get("/ctm-indicadores", authMiddleware, (req, res) => {
  modelControlMando
    .consultar_RegistrosIndicadores()
    .then((lista_Indicadores) => {
      res.render(config.rutaPartials + "indicador/list", {
        layout: false,
        list: lista_Indicadores,
      });
    });
});

module.exports = router;
