const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");
const modelControlMando = require("../models/controlMandoModel");

  router.get("/ctm-estrategias", authMiddleware, (req, res) => {
    modelControlMando
      .consultar_RegistrosEstrategias()
      .then((lista_Estrategias) => {
        res.render(config.rutaPartials + "estrategia/list", {
          layout: false,
          list: lista_Estrategias,
        });
      });
  });

  router.get("/form-ctm-estrategia/:id", authMiddleware, (req, res) => {
    modelControlMando
      .consultar_RegistroEstrategia_x_id(req.params.id)
      .then((estrategia_info) => {
        modelControlMando
          .consultar_RegistrosPlan_General()
          .then((listaPlanes_grales) => {
            modelControlMando
              .consultar_RegistrosLineasAccion()
              .then((lineas_accion) => {
                modelControlMando
                  .consultar_RegistrosObjetivos()
                  .then((lista_objetivos) => {
                    return res.render(config.rutaPartials + "estrategia/form", {
                      layout: false,
                      id_estrategia: req.params.id,
                      planes_generales: listaPlanes_grales,
                      estrategia_info: estrategia_info,
                      lineas_accion: lineas_accion,
                      lista_objetivos: lista_objetivos,
                    });
                  });
              });
          });
      });
  });
  

  router.post("/persistir-estrategia/", authMiddleware, (req, res) => {
    modelControlMando
      .insertar_estrategia(req.body.estrategia, req.body.objetivo)
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
  

  
  router.put("/actualizar-estrategia", authMiddleware, (req, res) => {
    modelControlMando
      .actualizar_RegistroEstrategia_x_id(
        req.body.id_estrategia,
        req.body.id_objetivo,
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
    "/estrategia/delete/:id/control-mando-bips",
    authMiddleware,
    function (req, res) {
      modelControlMando
        .eliminar_RegistroEstrategia(req.params.id)
        .then((respuesta) => {
          if (respuesta["command"] == "DELETE" && respuesta["rowCount"] > 0) {
            return res.status(200).send("Ok");
          } else {
            return res.status(500).send("Error al guardar datos");
          }
        });
    }
  );


module.exports = router;