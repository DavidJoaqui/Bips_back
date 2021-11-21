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



router.get("/ctm-registro-indicadores", authMiddleware, (req, res) => {
    modelControlMando
      .consultar_reg_indicadores()
      .then((lista_registro_indicadores) => {
        res.render(config.rutaPartials + "registroIndicador/list", {
          layout: false,
          list: lista_registro_indicadores,
        });
      });
  });


router.put(
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


module.exports = router;