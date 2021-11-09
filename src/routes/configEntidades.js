const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");
const modelEntidad = require("../models/entidadesModel");

router.get("/config-entidades", authMiddleware, (req, res) => {
  modelEntidad
    .consultar_registro_entidades()
    .then((listaentidades) => {
      res.render(config.rutaPaginas + "entidades", {
        registroEntidades: listaentidades,
        status: 200,
        code: 0,
        retorno: "0",
        user: req.session.user,
        area: req.session.username["nombre_area"],
      });
    })
    .catch((err) => {
      return res.status(500).send("Error obteniendo registros");
    });
});

router.get("/form-crear-entidad", authMiddleware, (req, res) => {
  res.render(config.rutaPartials + "entidad/newEntidad", {
    layout: false,
    user: req.session.user,
  });
});

router.get("/form-editar-entidad/:id_ent", authMiddleware, (req, res) => {
  modelEntidad
    .consultar_registro_entidad_x_id(req.params.id_ent)
    .then((resultado) => {
      res.render(config.rutaPartials + "entidad/editEntidad", {
        layout: false,
        user: req.session.user,
        res_cod_ent: resultado[0].cod_entidad,
        res_nombre_ent: resultado[0].nombre_entidad,
        res_tipo_reg: resultado[0].tipo_reg,
        res_id_entidad: resultado[0].id_entidad,
      });
    })
    .catch((err) => {
      return res.status(500).send("Error obteniendo registros");
    });
});

router.post("/persistir-entidad", authMiddleware, (req, res) => {
  modelEntidad
    .obtener_mayor_id_entidad()
    .then((respuesta__max) => {
      modelEntidad
        .insertar_registro_entidades(
          req.body.cod_entidad,
          req.body.nombre_entidad,
          req.body.tipo_reg,
          respuesta__max[0].max + 1
        )
        .then((respuesta) => {
          if (respuesta["command"] == "INSERT" && respuesta["rowCount"] > 0) {
            return res.status(200).send("Ok");
          } else {
            return res.status(400).send("Error al guardarla entidad");
          }
        })
        .catch((err) => {
          return res.status(400).send("Error al guardar la entidad ya existe");
        });
    })
    .catch((err) => {
      return res.status(500).send("Error al guardar datos");
    });
});

router.put("/actualizar-entidad", authMiddleware, (req, res) => {
  modelEntidad
    .actualizar_registro_entidades(
      req.body.cod_entidad,
      req.body.nombre_entidad,
      req.body.tipo_reg,
      req.body.id_ent
    )
    .then((respuesta) => {
      if (respuesta["command"] == "UPDATE" && respuesta["rowCount"] > 0) {
        return res.status(200).send("Ok");
      } else {
        return res.status(400).send("Error al actualizar la entidad");
      }
    })
    .catch((err) => {
      return res.status(500).send("Error al actualizar datos");
    });
});

router.delete(
  "/file/delete-entidad/:name/archivo-bips",
  authMiddleware,
  function (req, res) {
    if (req.query.regimen == "CONTRIBUTIVO") {
      var regimen = "C";
    } else if (req.query.regimen == "OTRO") {
      var regimen = "O";
    } else if (req.query.regimen == "SUBSIDIADO") {
      var regimen = "S";
    } else if (req.query.regimen == "VINCULADO") {
      var regimen = "C";
    } else if (req.query.regimen == "ESPECIAL") {
      var regimen = "E";
    }
    modelEntidad
      .eliminar_registro_entidades(req.params.name, regimen)
      .then((respuesta) => {
        if (respuesta["command"] == "DELETE" && respuesta["rowCount"] > 0) {
          return res.status(200).send("Ok");
        } else {
          return res.status(400).send("Error bd");
        }
      })
      .catch((err) => {
        return res.status(500).send("Error obteniendo registros");
      });
  }
);

module.exports = router;
