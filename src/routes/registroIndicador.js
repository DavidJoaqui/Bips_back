const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");
const modelControlMando = require("../models/controlMandoModel");
const multer = require("multer");
const path = require("path");

router.get("/form-ctm-registro-indicador/:id", authMiddleware, (req, res) => {

  
  modelControlMando
    .consultar_reg_indicadores_x_id(req.params.id)
    .then((item) => {
      modelControlMando
        .consultar_indicadorxarea(req.session.username["id_area"])
        .then((listaIndicadores) => {
          res.render(config.rutaPartials + "registroIndicador/form", {
            layout: false,
            id_reg_indicador: req.params.id,
            listaIndicadores: listaIndicadores,
            item: item,
          });
        });
    });
});

router.get("/form-ctm-detalle-registro-indicador/:id",
  authMiddleware,
  (req, res) => {
    modelControlMando
      .consultar_det_reg_ind_evaluacion(req.params.id)
      .then((item) => {
        res.render(config.rutaPartials + "registroIndicador/detalle", {
          layout: false,
          id_reg_indicador: req.params.id,
          item: item,
        });
      });
  }
);

router.get("/consultar-vigencia-anio-profesional",
  authMiddleware,
  (req, res) => {
    modelControlMando
      .consultar_vigencia_año(
        req.session.username["id_profesional"],
        Number(req.query.indicador)
      )
      .then((lista_años) => {
        return res.send(lista_años);
      });
  }
);

router.get("/consultar-periodo-x-anio", authMiddleware, (req, res) => {

  

  modelControlMando
    .consultar_periodoxaño(req.query.año,
      Number(req.session.username["id_area"]),
      Number(req.session.username["id_profesional"]),
      req.query.indicador
      )
    .then((lista_periodo) => {
      console.log(lista_periodo);
      return res.send(lista_periodo);
    });
});

router.get("/consultar-detalle-indicador-x-indicador",
  authMiddleware,
  (req, res) => {
    modelControlMando
      .consultar_det_indicador(
        req.query.vigencia,
        req.query.periodo,
        req.session.username["id_area"],
        Number(req.query.indicador)
      )
      .then((lista_detalle_indicador) => {
        return res.send(lista_detalle_indicador);
      });
  }
);

//metodo de almacenamiento para los sportes cargados a un registro de indicador
const storage_soportes = multer.diskStorage({
  /* Se define el path con la palabra reservada de multer destination donde se le indica la 
    ruta abosluta para la carga de los soportes desde el registro de indicador
    path : dir_soportes_ctm
    esta ruta absoluta esta definida como statica para el servidor y se puede cambiar,
    NOTA ::: SE DEBE CAMBIAR EN --> router.use(express.static(dir_soportes_ctm));
  */
  destination: config.rutaSoportesCtm,

  filename: function (req, file, cb) {
    var ext = path.extname(file.originalname);

    if (
      ext !== ".txt" &&
      ext !== ".Txt" &&
      ext !== ".pdf" &&
      ext !== ".xlsx" &&
      ext !== ".docx"
    ) {
      return cb(
        "Solo se permite Archivos de texto(.txt), PDF(.pdf), Excel(.xlsx) o Word(.docx)"
      );
    } else {
      let fech_now = Date.now();
      let date_ = new Date(fech_now);

      let fecha_completa_sinSeparador =
        date_.getDate() +
        "" +
        (date_.getMonth() + 1) +
        "" +
        date_.getFullYear() +
        "_";
      let hora = date_.getHours() + "_" + date_.getMinutes() + "_";

      cb("", "_" + fecha_completa_sinSeparador + hora + file.originalname);
    }
  },
});

const upload_soportes = multer({
  storage: storage_soportes,
});

router.get("/ctm-registro-indicadores", authMiddleware, (req, res) => {
  modelControlMando
    .consultar_reg_indicadores_x_profesional(req.session.username["id_profesional"])
    .then((lista_registro_indicadores) => {
      res.render(config.rutaPartials + "registroIndicador/list", {
        layout: false,
        list: lista_registro_indicadores,
      });
    });
});

router.post("/persistir-registro-indicador/",
  authMiddleware,
  upload_soportes.array("files_soporte"),
  (req, res) => {
    const version = '0';
    
    let numerador = parseFloat(req.body.txt_vr_numerador);
    let denominador = parseFloat(req.body.txt_vr_denominador);
    if (req.body.txt_vr_numerador == "") {
      numerador = 0;
    }
    if (req.body.txt_vr_denominador == "") {
      denominador = 0;
    }
    try {
      modelControlMando
        .insertar_registro_indicador(
          Number(req.body.select_indicador),
          req.session.username["id_profesional"],
          req.body.select_vigencia,
          Number(req.body.select_periodo),
          numerador,
          denominador,
          req.body.txt_observacion,
          "0",
          version
        )
        .then((respuesta) => {
          if (respuesta["command"] == "INSERT" && respuesta["rowCount"] > 0) {
            return res.status(200).send("Ok");
          } else {
            return res
              .status(400)
              .send("Error al guardarla Registro Indicador");
          }
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).send("Error al guardar datos");
        });
    } catch (err) {
      console.log(err);
      return res.status(500).send("Error al guardar datos");
    }
  }
);

router.put("/actualizar-registro-indicador", authMiddleware,upload_soportes.array("files_soporte"),
  (req, res) => {
    console.log(req.body);
    modelControlMando
      .actualizar_reg_indicador(
        Number(req.body.id_reg_indicador),
        Number(req.body.txt_vr_numerador),
        Number(req.body.txt_vr_denominador),
        req.body.txt_observacion
      )
      .then((respuesta) => {
        if (respuesta["command"] == "UPDATE" && respuesta["rowCount"] > 0) {
          for (let i in req.files) {
            try {
              let ext = path.extname(req.files[i].originalname);

              let id_registro_indicador = req.body.id_registroindicador;
              let nombre_soporte = req.files[i].filename;
              let path_soporte = req.files[i].path;
              let es_habilitado = true;
              let extension = ext;
              let mime = req.files[i].mimetype;
              let es_valido = true;
              let peso = req.files[i].size;
              let nombre_original = req.files[i].originalname;

              modelControlMando
                .insertar_SoporteRegistroIndicador(
                  id_registro_indicador,
                  nombre_soporte,
                  path_soporte,
                  es_habilitado,
                  extension,
                  mime,
                  es_valido,
                  peso,
                  nombre_original
                )
                .then((respuesta) => {
                  if (
                    respuesta["command"] == "INSERT" &&
                    respuesta["rowCount"] > 0
                  ) {
                    return res.status(200).send("Ok");
                  } else {
                    return res.status(400).send("Error al guardarla entidad");
                  }
                });
              return res.status(200).send("Ok");
            } catch (error) {
              return res.status(500).send("Error al guardar datos");
            }
          }

          return res.status(200).send("Ok");
        } else {
          return res.status(400).send("Error al guardarla entidad");
        }
      })
      .catch((err) => {
        return res.status(500).send("Error al guardar datos");
      });
  }
);

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
            });
        } else {
          return res.status(500).send("Error al guardar datos");
        }
      });
  }
);

module.exports = router;
