

const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");
const modelControlMando = require("../models/controlMandoModel");
const multer = require("multer");


//metodo de almacenamiento para los sportes cargados a un registro de indicador
const storage_soportes = multer.diskStorage({
  /*  Se define el path con la palabra reservada de multer destination donde se le indica la 
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

      console.log(
        "nombre generado para el archivo : " +
          "_" +
          fecha_completa_sinSeparador +
          hora +
          file.originalname
      );
      cb("", "_" + fecha_completa_sinSeparador + hora + file.originalname);
    }
  },
});

const upload_soportes = multer({
  storage: storage_soportes,
});


  
  router.post(
    "/persistir-registro-indicador",
    authMiddleware,
    upload_soportes.array("files_soporte"),
    (req, res) => {

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
  

  
      var numerador = parseFloat(req.body.txt_vr_numerador);
      var denominador = parseFloat(req.body.txt_vr_denominador);
      if (req.body.txt_vr_numerador == "") {
        numerador = 0;
      }
      if (req.body.txt_vr_denominador == "") {
        denominador = 0;
      }
  
      try {
        var version = Number(req.body.select_version);
        if (version == 0) {
          version = 1;
        } else {
          version = version + 1;
        }
  
        modelControlMando
          .insertar_registro_indicador(
            Number(req.body.select_indicador),
            Number(req.body.select_profesional),
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
     
              for (var i in req.files) {
   
                var ext = path.extname(req.files[i].originalname);
  
                var id_registro_indicador =
                  respuesta["rows"][0].id_registroindicador;
                var nombre_soporte = req.files[i].filename;
                var path_soporte = req.files[i].path;
                var es_habilitado = true;
                var extension = ext;
                var mime = req.files[i].mimetype;
                //var fecha_carga = date_;
                var es_valido = true;
                var peso = req.files[i].size;
                var nombre_original = req.files[i].originalname;
  
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
                    }else{
                      return res.status(400).send("Error al guardarla entidad");
                    }
                  });
              }
        
              return res.status(200).send("Ok");
            } else {
              return res.status(400).send("Error al guardarla entidad");
            }
          })
          .catch((err) => {
            return res.status(500).send("Error al guardar datos");
          });
  

      } catch (error) {
        return res.status(500).send("Error al guardar datos");
      }
    }
  );
  
  
  router.post("/persistir-calificacion-indicador", authMiddleware, (req, res) => {
    modelControlMando
      .insertar_calificacion_indicador(
        Number(req.query.reg_indicador),
        parseFloat(req.query.vr_numerador),
        parseFloat(req.query.vr_denominador),
        parseFloat(req.query.resultado_numerico),
        Number(req.query.resultado_descriptivo),
        parseFloat(req.query.desviacion),
        req.query.comentario,
        Number(req.query.estado)
      )
      .then((respuesta) => {
        if (respuesta["command"] == "INSERT" && respuesta["rowCount"] > 0) {
          //actualizarRegIndicador
          modelControlMando
            .actualizar_RegIndicador_calificado(req.query.reg_indicador)
            .then((calificado) => {
              if (
                calificado["command"] == "UPDATE" &&
                calificado["rowCount"] > 0
              ) {
                console.log(
                  "OK... insert NEW Indicador, update registro de indicador --> calificado: 1"
                );
                res.json({
                  status: 200,
                  msg: "La Calificación del Indicador se registro correctamente...",
                });
              } else {
                console.log(
                  "Ocurrio un Error al actualizar la calificacion el registro de Indicador"
                );
                res.json({
                  status: 200,
                  msg: "Ocurrio un Error al actualizar la calificacion el registro de Indicador",
                });
              }
            });
        } else {
          res.json({
            status: 300,
            msg: "ERROR al crear al calificar el Indicador, intente de nuevo...",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({
          status: 500,
          msg: "ERROR!! Calificación Indicador YA EXISTE...",
        });
      });
  });



  router.get(
    "/obtener-reg-indicadores_xvigencia_xperiodo_xarea",
    authMiddleware,
    (req, res) => {
      //console.log('id_area:' + req.query.area);
      //console.log('VIGENCIA:' + req.query.vigencia);
      //console.log('PERIODO:' + req.query.periodo);
  
      modelControlMando
        .consultar_indicadorxVigencia_xPeriodo_xarea(
          req.query.vigencia,
          req.query.periodo,
          req.query.area
        )
        .then((resultados_reg_indicadores) => {
          res.send(resultados_reg_indicadores);
        });
    }
  );
  
  router.get(
    "/consultar-indicador-x-periodo-area",
    authMiddleware,
    (req, res) => {
      modelControlMando
        .consultar_indicadorxperiodo_area(
          req.query.area,
          req.query.periodo,
          req.query.area
        )
        .then((lista_indicadores) => {
          res.send(lista_indicadores);
        });
    }
  );
  
  router.get("/consultar-indicador-x-area", authMiddleware, (req, res) => {
    modelControlMando
      .consultar_indicadorxarea(req.query.id_area)
      .then((lista_indicadores) => {
        res.send(lista_indicadores);
      });
  });
  
  router.get(
    "/consultar-detalle-indicador-x-indicador",
    authMiddleware,
    (req, res) => {
      //console.log('id_area:' + req.query.area);
      // console.log('id_area:' + req.query.area);
      //console.log('VIGENCIA:' + req.query.vigencia);
      //console.log('PERIODO:' + req.query.periodo);
      console.log("indicador:" + req.query.indicador);
      modelControlMando
        .consultar_det_indicador(
          req.query.vigencia,
          req.query.periodo,
          req.query.area,
          req.query.indicador
        )
        .then((lista_detalle_indicador) => {
          res.send(lista_detalle_indicador);
        });
    }
  );
  
  router.get("/ctm-indicadores-planes", authMiddleware, (req, res) => {
    modelControlMando.consultar_RegistroPlanes().then((lista_planes) => {
      //console.log(lista_planes);
      res.render("paginas/ctm_indicadores", {
        user: req.session.user,
        lista_planes: lista_planes,
      });
    });
  });
  
  

  //consultar_reg_indicadores_x_profesional
  router.get(
    "/lista_reg_indicadores_x_profesional",
    authMiddleware,
    (req, res) => {
      modelControlMando
        .consultar_reg_indicadores_x_profesional(req.query.id_profesional)
        .then((lista_registro_indicadores) => {
          //console.log(lista_Estrategias);lista_Estrategias
          res.render("paginas/lista_ctm_reg_indicadores", {
            lista_registro_indicadores: lista_registro_indicadores,
          });
        });
    }
  );
  
  router.get("/lista-ctm-cal-indicadores", authMiddleware, (req, res) => {
    modelControlMando
      .consultar_calificacion_indicadores()
      .then((lista_calificacion_indicadores) => {
        //console.log(lista_Estrategias);lista_Estrategias
        res.render("paginas/lista_ctm_calificacion_indicadores", {
          lista_calificacion_indicadores: lista_calificacion_indicadores,
        });
      });
  });

//-------------------------------------------------------------------

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
      req.body.formula_literal_num,
      req.body.form_literal_den
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
        console.log(rspta_eliminacion);
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



router.get("/form-ctm---indicador/:id", authMiddleware, (req, res) => {
  modelControlMando
    .consultar_areaxid(Number(req.session.username["id_area"]))
    .then((lista_area) => {
      res.render(config.rutaPartials + "indicador/form", {
        layout: false,
        user: req.session.user,
        id_profesional: Number(req.session.username["id_profesional"]),
        item: lista_area,
      });
    });
});

  router.get("/form-ctm-indicador/:id", authMiddleware, (req, res) => {
    modelControlMando
      .consultar_det_reg_ind_evaluacion(req.params.id)
      .then((indicador_info) => {
        res.render(config.rutaPartials + "indicador/form", {
          layout: false,
          id_reg_indicador: req.params.id,
          item: indicador_info,
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