const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const config = require("../config/config");
const authMiddleware = require("../middlewares/auth");
// Declaracion de variables para los modelos
const modelplanos = require("../models/archivosPlanosModel");
const modelbips = require("../models/modelModel");

const storage = multer.diskStorage({
  destination: config.rutaFile + "/",
  // Req ->info peticion, file ->archivo que se sube, cb ->funcion finalizacion

  filename: function (req, file, cb) {
    var numcarga = req.files.length;

    modelplanos.cantidad_RegistrosPlanos_tmp().then((rescount) => {
      var ext = path.extname(file.originalname);

      var numplanos = Number(Object.values(rescount[0]));
      numplanos = numplanos + numcarga;

      modelplanos.consultar_RegistrosPlanos_tmp().then((rsta) => {
        if (rsta == "") {
          if (ext !== ".txt" && ext !== ".Txt") {
            return cb("Solo se permite Archivos Formato .txt");
          } else if (numplanos > 10) {
            return cb("Solo se permite Maximo 10 Archivos planos");
          } else {
            let fech_now = Date.now();

            let date_ = new Date(fech_now);

            let fecha_completa =
              date_.getDate() +
              "" +
              (date_.getMonth() + 1) +
              "" +
              date_.getFullYear();

            cb(
              "",
              "_" + fecha_completa + "_" + file.originalname
            );
          }
        } else {
          rsta.forEach((plano) => {
            if (plano["nombre_original"] == file.originalname) {
              return cb(
                "Error: Archivo " + file.originalname + " esta cargado"
              );
            }

            if (numcarga > 10) {
              return cb("Solo se permite Maximo 10 Archivos planos");
            } else if (ext !== ".txt" && ext !== ".Txt") {
              return cb("Solo se permite Archivos Formato .txt");
            } else if (numplanos > 10) {
              return cb("Solo se permite Maximo 10 Archivos planos");
            } else {
              let fech_now = Date.now();

              let date_ = new Date(fech_now);

              let fecha_completa =
                date_.getDate() +
                "" +
                (date_.getMonth() + 1) +
                "" +
                date_.getFullYear();
              cb(
                "",
                "_" + fecha_completa + "_" + file.originalname
              );
            }
          });
        }
      });
    });
  },
});

const upload = multer({
  storage: storage,
});

router.get("/cargar-plano", authMiddleware, function (req, res) {
  modelbips
    .obtenerIps()
    .then((listaIps) => {
      res.render(config.rutaPaginas + "formularioCarga", {
        listaIps: listaIps,
        user: req.session.user,
        area: req.session.username["nombre_area"],
      });
    })
    .catch((err) => {
      return res.status(500).send("Error obteniendo registros");
    });
});

router.get("/listado-archivos", authMiddleware, (req, res) => {
  var bandera_panel_envio = false;
  var habilitar_carga_bandera = false;
  var habilitar_eliminar_all = true;
  var bandera_btn_enviar = false;

  modelplanos.ObtenerPlanos_validos().then((planos_val) => {
    modelplanos.validarPlanosNecesarios(planos_val).then((rsta) => {
      if (rsta == 1) {
        bandera_panel_envio = true;

        modelplanos.consultar_RegistrosPlanos_tmp().then((planos_all) => {
          modelplanos
            .contar_Planos_Validados()
            .then((conteo_planos) => {
              if (conteo_planos[0]["total_validados"] >= 10) {
                bandera_btn_enviar = false;
                habilitar_carga_bandera = true;
                habilitar_eliminar_all = false;

                modelplanos
                  .validarPlanosCargados(planos_all)
                  .then((rsta_cargados) => {
                    if (rsta_cargados == 0) {
                      habilitar_carga_bandera = false;

                      bandera_btn_enviar = true;

                      habilitar_eliminar_all = false;

                      res.setHeader("Content-type", "text/html");
                      res.render(
                        config.rutaPartials + "cargaPlano/listaPlano",
                        {
                          layout: false,
                          arr_files: planos_all,
                          habilitar_envio_la: bandera_panel_envio,
                          habilitar_carga: habilitar_carga_bandera,
                          habilitar_eliminar: habilitar_eliminar_all,
                          habilitar_btn_envio: bandera_btn_enviar,
                        }
                      );
                    } else {
                      modelplanos
                        .consultar_RegistrosPlanos_tmp()
                        .then((listaArchivos) => {
                          res.render(
                            config.rutaPartials + "cargaPlano/listaPlano",
                            {
                              layout: false,
                              arr_files: listaArchivos,
                              habilitar_envio_la: bandera_panel_envio,
                              habilitar_carga: habilitar_carga_bandera,
                              habilitar_eliminar: habilitar_eliminar_all,
                              habilitar_btn_envio: bandera_btn_enviar,
                            }
                          );
                        });
                    }
                  });
              } else {
                bandera_panel_envio = false;

                res.setHeader("Content-type", "text/html");
                res.render(config.rutaPartials + "cargaPlano/listaPlano", {
                  layout: false,
                  arr_files: planos_all,
                  habilitar_envio_la: bandera_panel_envio,
                  habilitar_carga: habilitar_carga_bandera,
                  habilitar_eliminar: habilitar_eliminar_all,
                  habilitar_btn_envio: bandera_btn_enviar,
                });
              }
            })
            .catch((err) => {
              return res.status(500).send("Error obteniendo registros");
            });
        });
      } else {
        modelplanos.consultar_RegistrosPlanos_tmp().then((listaArchivos) => {
          res.render(config.rutaPartials + "cargaPlano/listaPlano", {
            layout: false,
            arr_files: listaArchivos,
            habilitar_envio_la: bandera_panel_envio,
            habilitar_carga: habilitar_carga_bandera,
            habilitar_eliminar: habilitar_eliminar_all,
            habilitar_btn_envio: bandera_btn_enviar,
          });
        });
      }
    });
  });
});

router.delete(
  "/file/delete/:name/archivo-bips",
  authMiddleware,
  function (req, res) {
    let name = req.params.name;

    fs.unlink(
      path.join(config.rutaFile + "/" + name),
      (err) => {
        if (err) {
          console.log(
            "No se pudo borrar el archivo,posiblemente este ya NO existe, por favor contacte con el administrador"
          );
        }
        var array_nombre = name.split("_");
        modelplanos
          .eliminar_RegistrosPlanos_tmp(req.query.id_ips, name)
          .then((respuesta) => {
            if (respuesta["command"] == "DELETE" && respuesta["rowCount"] > 0) {
              modelplanos
                .consultar_RegistrosPlanos_tmp()
                .then((listaArchivos) => {
                  return res
                    .status(200)
                    .send(
                      "El archivo plano " +
                        array_nombre[2] +
                        " se eliminó correctamente..."
                    );
                })
                .catch((err) => {
                  return res.status(500).send("No se elimino");
                });
            } else {
              return res.status(500).send("No se elimino");
            }
          });
      }
    );
  }
);

router.post(
  "/files",
  authMiddleware,
  upload.array("files"),
  (req, res, err) => {
    let periodo = req.body.txtfecha_inicial + " - " + req.body.txtfecha_final;

    let fechNow = Date.now();

    let date_ = new Date(fechNow);

    let fecha_completa =
      date_.getDate() +
      "/" +
      (date_.getMonth() + 1) +
      "/" +
      date_.getFullYear();
    let fecha_completa_sinSeparador =
      date_.getDate() +
      "" +
      (date_.getMonth() + 1) +
      "" +
      date_.getFullYear() +
      "_";
    let hora =
      date_.getHours() + ":" + date_.getMinutes() + ":" + date_.getSeconds();

    let fecha_hora = fecha_completa + " " + hora;

    for (var i in req.files) {
      let path_ins = path.join(       
          config.rutaFile +
          "/" +          
          "_" +
          fecha_completa_sinSeparador +
          req.files[i].originalname
      );
      let nombre_temp =        
        "_" +
        fecha_completa_sinSeparador +
        req.files[i].originalname;

      try {
        modelplanos
          .insertar_RegistrosPlanos_tmp(
            req.body.cbxips,
            req.body.nombre_ips,
            periodo,
            req.files[i].originalname,
            req.files[i].mimetype,
            fecha_hora,
            "0",
            nombre_temp,
            path_ins
          )
          .then((respuesta) => {
            if (respuesta["command"] == "INSERT" && respuesta["rowCount"] > 0) {
              return res
                .status(200)
                .send("La operación se ejecuto con exito..");
            } else {
              return res.status(400).send("Error guardar los archivos Bd");
            }
          });
      } catch (error) {
        return res.status(500).send("Error guardar los archivos");
      }
    }
  }
);

router.get(
  "/validar-registros-ap/:ips",
  authMiddleware,
  async function (req, res, next) {
    modelbips
      .validarRegistrosAP(
        req.params.ips,
        req.query.fecha_inicial,
        req.query.fecha_fin
      )
      .then((validaregistros) => {
        const respuesta = validaregistros.rows[0].total_reg;
        return res.send(respuesta);
      });
  }
);

router.delete("/delete-all/archivo-bips", authMiddleware, (req, res) => {
  // Método para eliminar todos los archivos planos cargados
  fs.readdir(path.join(__dirname, config.rutaFile), (err, files) => {
    if (err) {
      res.json({ resultado: err });
    } else if (files.length == 0) {
      res.json({ resultado: "DATA_NOT_FOUND" });
    } else {
      files.forEach((file) => {
        try {
          var ruta = path.join(__dirname, config.rutaFile) + "/" + file;
          fs.unlinkSync(ruta);
        } catch (error) {
          console.error("Something wrong hrouterened removing the file", error);
        }
      });

      modelplanos
        .eliminar_all_RegistrosPlanos_tmp()
        .then((respuesta) => {
          if (respuesta["command"] == "DELETE" && respuesta["rowCount"] > 0) {
          }
        })
        .catch((err) => {
          console.log(err);
        });

      req.flash("notify", "Los archivos fueron eliminados correctamente..");
      res.json({ resultado: "OK", status: 200 });
    }
  });
});

module.exports = router;
