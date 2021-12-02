const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const modelControlMando = require("../models/controlMandoModel");

// Cmb list
router.get("/consultar-tipo-meta-area-x-plan", authMiddleware, (req, res) => {
  modelControlMando
    .consultar_tipometaxidplan(req.query.id_plan)
    .then((lista_tipo_meta) => {
      res.send(lista_tipo_meta);
    });
});

router.get("/consultar-areaxid", authMiddleware, (req, res) => {
  modelControlMando.consultar_areaxid(req.query.id_area).then((lista_areas) => {
    console.log(lista_areas);
    res.send(lista_areas);
  });
});

router.get(
  "/consultar-objetivo-x-lineas-accion",
  authMiddleware,
  (req, res) => {
    modelControlMando
      .consultar_ObjetivosXlinea(req.query.id_linea_accion)
      .then((lista_objetivos) => {
        res.send(lista_objetivos);
      });
  }
);

router.get("/consultar-estrategia-x-objetivo", authMiddleware, (req, res) => {
  modelControlMando
    .consultar_EstartegiasXobetivo(req.query.id_objetivo)
    .then((lista_Estrategias) => {
      res.send(lista_Estrategias);
    });
});

router.get(
  "/consultar-plan-accion-x-estrategia",
  authMiddleware,
  (req, res) => {
    modelControlMando
      .consultar_PlanesXestrategia(req.query.id_estrategia)
      .then((lista_Planes) => {
        res.send(lista_Planes);
      });
  }
);

router.get(
  "/consultar-periodo-evaluacion-x-id-indicador",
  authMiddleware,
  (req, res) => {
    modelControlMando
      .consultar_per_evaluacionxidindicador(req.query.id_indicador)
      .then((lista_periodo_evaluacion) => {
        res.send(lista_periodo_evaluacion);
      });
  }
);

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

module.exports = router;
