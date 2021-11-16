const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");
const modelControlMando = require("../models/controlMandoModel");

router.get("/ctm-areas",authMiddleware, (req, res) => {
  modelControlMando.consultar_RegistroAreas().then((lista_areas) => {
    res.render(config.rutaPartials + "area/list", {
      layout: false,
      list: lista_areas,
    });
  });
});

router.get("/form-ctm-area/:id", authMiddleware, (req, res) => {
  modelControlMando.consultar_areaxid(req.params.id).then((item) => {
    return res.render(config.rutaPartials + "area/form", {
      layout: false,
      id_area: req.params.id,
      item: item,
    });
  });
});

router.post("/persistir-area/", authMiddleware, (req, res) => {
  modelControlMando
    .insertar_area(req.body.nombre_area)
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

router.put("/actualizar-area", authMiddleware, (req, res) => {
  modelControlMando
    .actualizar_area_x_id(req.body.id_area, req.body.nombre_area)
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
  "/area/delete/:id/control-mando-bips",
  authMiddleware,
  function (req, res) {
    return res.status(500).send("Error al guardar datos");
  }
);

module.exports = router;
