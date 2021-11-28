const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");
const modelControlMando = require("../models/controlMandoModel");
const multer = require("multer");
const { consultarRoles } = require("../models/controlMandoModel");
const session = require("express-session");

router.get("/form-ctm-registro-indicador/:id", authMiddleware, (req, res) => {
    modelControlMando
    .consultar_reg_indicadores_x_id(req.params.id)
    .then((item) => {
      modelControlMando
        .consultar_indicadorxarea(12)
        .then((listaIndicadores) => {
         
              
              res.render(config.rutaPartials + "registroIndicador/form", {
                layout: false,
                id_reg_indicador:req.params.id,
                listaIndicadores: listaIndicadores,
                item: item
              });
            
        });
    });
});

router.get("/consultar-vigencia-anio-profesional",
  authMiddleware,
  (req, res) => {
    modelControlMando
          .consultar_vigencia_año(Number(req.query.profesional), Number(req.query.indicador))
      .then((lista_años) => {
        return res.send(lista_años);
      });
  }
);

router.get("/consultar-periodo-x-anio",
  authMiddleware,
  (req, res) => {
    modelControlMando
          .consultar_periodoxaño(req.query.año)
      .then((lista_periodo) => {
      return res.send(lista_periodo);
        
      });
  }
);

router.get("/consultar-detalle-indicador-x-indicador",
  authMiddleware,
  (req, res) => {
    modelControlMando
          .consultar_det_indicador(req.query.vigencia, req.query.periodo, req.query.area, req.query.indicador)
      .then((lista_detalle_indicador) => {
        
        return res.send(lista_detalle_indicador);
      });
  }
);


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
    console.log('fdfdf...')
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



router.get("/ctm-registro-indicadores", authMiddleware, (req, res) => {
  
  modelControlMando
      .consultar_reg_indicadores_x_profesional(req.session.username["id_profesional"])
      .then((lista_registro_indicadores) => {
        console.log(lista_registro_indicadores);
        res.render(config.rutaPartials + "registroIndicador/list", {
          layout: false,
          list: lista_registro_indicadores,
        });
      });
  });


  router.post("/persistir-registro-indicador/", authMiddleware, (req, res) => {
    let fech_now = Date.now();
    let date_ = new Date(fech_now);
   console.log('fdfdf')

    console.log(req.files);

    console.log("version:" + Number(req.body.select_version));
    console.log("numerador:" + (req.body.txt_vr_numerador));
    console.log("denominador:" + (req.body.txt_vr_denominador));

    var numerador = parseFloat(req.body.txt_vr_numerador);
    var denominador = parseFloat(req.body.txt_vr_denominador);
    if (req.body.txt_vr_numerador == '') {
        numerador = 0;
    }
    if (req.body.txt_vr_denominador == '') {
        denominador = 0;

    }
    try {

      modelControlMando.insertar_registro_indicador(
        Number(req.body.select_indicador),
        Number(req.body.select_profesional),
        req.body.select_vigencia,
        Number(req.body.select_periodo),
        numerador,
        denominador,
        req.body.txt_observacion,
        '0', version)
        .then((respuesta) => {
          if (respuesta["command"] == "INSERT" && respuesta["rowCount"] > 0) {
            return res.status(200).send("Ok");
          } else {
            return res.status(400).send("Error al guardarla Registro Indicador");
          }
        })
        .catch((err) => {
          return res.status(500).send("Error al guardar datos");
        });

    }catch (err) {
      return res.status(500).send("Error al guardar datos");
    }
    
  });


router.put("/actualizar-registro-indicador",
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
                      return res.status(200).send("Ok");
                    }else{
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

  router.delete("/plan-general/delete/:id/control-mando-bips",
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