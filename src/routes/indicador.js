const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");
const modelControlMando = require("../models/controlMandoModel");

router.put("/actualizar-indicador", authMiddleware, (req, res) => {
  modelControlMando
    .actualizar_indicador(
      req.body.id_indicador,
      req.body.indicador,
      req.body.plan_accion,
      req.body.area,
      req.body.tipo_meta,
      req.body.literal_descriptiva,
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
      req.body.indicador,
      req.body.plan_accion,
      req.body.area,
      req.body.tipo_meta,
      req.body.literal_descriptiva,
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

router.delete(
  "/indicador/delete/:id/control-mando-bips",
  authMiddleware,
  function (req, res) {
    modelControlMando
      .eliminar_Indicador(req.params.id)
      .then((rspta_eliminacion) => {
        if (
          rspta_eliminacion["command"] == "DELETE" &&
          rspta_eliminacion["rowCount"] > 0
        ) {
          modelControlMando
            .eliminar_Registro_RegIndicador(req.params.id)
            .then((respuesta) => {
              if (
                respuesta["command"] == "DELETE" &&
                respuesta["rowCount"] > 0
              ) {
                return res.status(200).send("Ok");
              } else {
                return res.status(400).send("Error al guardar datos");
              }
            })
            .catch((err) => {
              return res.status(500).send("Error al guardar datos");
            });
        }else{
          return res.status(400).send("Error al guardar datos");
        }
      })
      .catch((err) => {
        return res.status(500).send("Error al guardar datos");
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
          modelControlMando.consultar_RegistroAreas().then((lista_areas) => {
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
