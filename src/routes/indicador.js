

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


// Persistir-indicador
router.post("/persistir-indicador", authMiddleware, (req, res) => {

  
    modelControlMando
      .insertar_indicador(
        req.query.nombre_indicador,
        req.query.plan_accion,
        req.query.area,
        req.query.tipo_meta,
        req.query.formula_descriptiva,
        req.query.meta_descriptiva,
        Number(req.query.periodo_evaluacion),
        req.query.meta_numerica,
        req.query.formula_literal_num,
        req.query.form_literal_den
      )
      .then((respuesta) => {
        if (respuesta["command"] == "INSERT" && respuesta["rowCount"] > 0) {

          res.json({
            status: 200,
            msg:
              "El Indicador <b>" +
              req.query.nombre_indicador +
              "</b>, se creó correctamente...",
          });
        } else {

          res.json({
            status: 300,
            msg:
              "ERROR al crear el Indicador <b>" +
              req.query.nombre_indicador +
              "</b>, intente de nuevo...",
          });
        }
      })
      .catch((err) => {

        res.json({
          status: 500,
          msg:
            "ERROR!! El Indicador <b>" +
            req.query.nombre_indicador +
            " </b> YA EXISTE...",
        });
      });
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
                      console.log(respuesta);
                      console.log("OK... upload");
  
                  
                    }
                  });
              }
        
              res.json({
                status: 200,
                msg: "El Registro Indicador , se creó correctamente...",
              });
            } else {
              res.json({
                status: 300,
                msg: "ERROR al crear el Registro Indicador , intente de nuevo...",
              });
            }
          })
          .catch((err) => {
            console.log(err);
            res.json({
              status: 500,
              msg: "ERROR!! El Registro  Indicador YA EXISTE...",
            });
          });
  

      } catch (error) {
        console.log("err " + error);
      }
    }
  );
  
  router.get(
    "/eliminar-popup-reg-indicador/:id_reg_indicador/control-mando-bips",
    authMiddleware,
    (req, res) => {

  
      let params = [
        req.params.id_reg_indicador,
        req.query.nombre_indicador,
        req.query.periodo,
        req.query.vigencia,
        req.query.version,
        req.query.id_profesional,
      ];
      res.render(
        path.join(__dirname + "/src/vista/paginas/popup-eliminar-reg-indicador"),
        { datos_plan: params }
      );
    }
  );
  
  router.post(
    "/registro-indicador/delete/:id/control-mando-bips",
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
            //eliminar_Registro_RegIndicador
            console.log(
              "Para el registro de indicador: " +
                req.params.id +
                " se Eliminaron: " +
                rspta_eliminacion["rowCount"] +
                " Soportes q estaban Adjuntos "
            );
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
                  console.log(
                    "respuesta de eliminacion: 1, Se elimino correctamente el registro de indicador..."
                  );
                  msg =
                    "El Registro de indicador para el indicador " +
                    req.query.nombre_indicador +
                    " se eliminó correctamente...";
                } else {
                  console.log(
                    "respuesta de eliminacion: ERROR... 0, ocurrio un problema al eliminar el registro de indicador " +
                      req.query.nombre_indicador
                  );
                  msg =
                    " ocurrio un problema al eliminar el registro de Indicador... " +
                    req.query.nombre_indicador;
                }
  
                req.flash("notify_del_reg_indicador", msg);
                res.redirect("/ctm-reg-indicadores");
              });
          }

        });
    }
  );
  
  router.post(
    "/actualizar-reg-indicador",
    authMiddleware,
    upload_soportes.array("files_soporte"),
    (req, res) => {

  
      modelControlMando
        .actualizar_reg_indicador(
          req.body.id_registroindicador,
          Number(req.body.txt_vr_numerador),
          Number(req.body.txt_vr_denominador),
          req.body.txt_observacion
        )
        .then((respuesta) => {
          console.log(respuesta);
          if (respuesta["command"] == "UPDATE" && respuesta["rowCount"] > 0) {

  
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
  

  
            for (var i in req.files) {

              try {
                var ext = path.extname(req.files[i].originalname);
  
                var id_registro_indicador = req.body.id_registroindicador;
                var nombre_soporte = req.files[i].filename;
                var path_soporte = req.files[i].path;
                var es_habilitado = true;
                var extension = ext;
                var mime = req.files[i].mimetype;
                var fecha_carga = date_;
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
                      console.log(respuesta);
                      console.log("OK... upload");
                    }
                  });
                res.json({
                  status: 200,
                  msg: "El Registro Indicador , se actualizo correctamente...",
                });
              } catch (error) {
                console.log("err " + error);
              }
            }
  
            res.send({
              status: 200,
              msg:
                "El registro del indicador " +
                req.body.nombre_indicador +
                " fue actualizado correctamente...",
            });
          } else {
            res.send({
              status: 300,
              msg:
                "ERROR al actualizar el registro del indicador <b>" +
                req.body.nombre_indicador +
                "</b> " +
                " intente de nuevo...",
            });
          }
        })
        .catch((err) => {
          res.json({
            status: 500,
            msg:
              "ERROR!! El regisitro para el indicador " +
              req.body.nombre_indicador +
              "NO se pudo actualizar...",
          });
        });
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


  router.get("/form-ctm-indicador", authMiddleware, (req, res) => {
    modelControlMando
      .consultar_areaxid(Number(req.session.username["id_area"]))
      .then((lista_area) => {
        res.render(config.rutaPartials + "controlMando/formCtmIndicador", {
          layout: false,
          user: req.session.user,
          id_profesional: Number(req.session.username["id_profesional"]),
          lista_areas: lista_area,
          nombre: req.session.username["nombre"],
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
  
  router.get("/lista-ctm-indicadores", authMiddleware, (req, res) => {
    modelControlMando
      .consultar_RegistrosIndicadores()
      .then((lista_Indicadores) => {
        //console.log(lista_Estrategias);lista_Estrategias
        res.render("paginas/lista_ctm_indicadores", {
          lista_Indicadores: lista_Indicadores,
        });
      });
  });
  
  router.get("/lista-ctm-reg-indicadores", authMiddleware, (req, res) => {
    modelControlMando
      .consultar_reg_indicadores()
      .then((lista_registro_indicadores) => {
        //console.log(lista_Estrategias);lista_Estrategias
        res.render("paginas/lista_ctm_reg_indicadores", {
          lista_registro_indicadores: lista_registro_indicadores,
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


  router.post("/form-editar-ctm-reg-indicador", authMiddleware, (req, res) => {
    console.log("id_indicador:" + req.query.id_reg_indicador);
    //console.log('id_area:' + req.query.id_area);
    modelControlMando
      .consultar_det_reg_ind_evaluacion(req.query.id_reg_indicador)
      .then((indicador_info) => {
        res.render("paginas/editar_reg_indicadores", {
          id_reg_indicador: req.query.id_reg_indicador,
          indicador_info: indicador_info,
        });
      });
  });
  

  module.exports = router;