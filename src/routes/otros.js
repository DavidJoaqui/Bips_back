const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");
// Declaracion de variables para los modelos
const modelplanos = require("../models/archivosPlanosModel");
const modelbips = require("../models/modelModel");
const modelvalidaciones = require("../models/validacionModel");
const modelControlMando = require("../models/controlMandoModel");




router.get("/obtenerRegistrosPlanos", authMiddleware, function (req, res) {
  modelbips
    .obtenerRegistrosPlanos()
    .then((registroplanos) => {
      res.render("paginas/RegistrosPlanos", {
        registroplanos: registroplanos,
        user: req.session.user,
        area: req.session.username["nombre_area"],
      });
    })
    .catch((err) => {
      return res.status(500).send("Error obteniendo registros");
    });
});





router.post(
  "/file/validar/:name/archivo-bips",
  authMiddleware,
  function (req, res) {
    let name_tmp = req.params.name;
    var array_nombre = name_tmp.split("_");
    let nombre_txt = array_nombre[2];

    var nombre_plano = nombre_txt.slice(0, 2);
    var habilita_eliminar_todos = false;

    modelplanos.contar_Planos_Validados().then((cont_planos_val) => {
      if (cont_planos_val.total_validados >= 1) {
        habilita_eliminar_todos = true;
      }
    });

    modelvalidaciones
      .validarPlano(name_tmp, nombre_plano)
      .then((rsta_validacion) => {
        //si la respuesta de validacion del plano, retorna la respuesta vacia ""
        //significa que el plano se valido CORRECTAMENTE.
        if (rsta_validacion == "") {
          modelplanos
            .validar_RegistrosPlanos_tmp(req.query.id_ips, name_tmp)
            .then((respuesta) => {
              if (
                respuesta["command"] == "UPDATE" &&
                respuesta["rowCount"] > 0
              ) {
                //Aqui se valida por cada iteracion de validacion de planos si todos se encuentran validados,
                //esto con el fin de habilitar el boton de envio de los planos ya validados, tener en cuenta los planos
                //que son necesarios AP, AC, AT, AH, AU , AF

                modelplanos.ObtenerPlanos_validos().then((planos_val) => {
                  modelplanos
                    .validarPlanosNecesarios(planos_val)
                    .then((rsta) => {
                      //Si la validacion de los planos necesarios resulta con exito "1" -> rsta = 1, el sistema debera habilitar el boton de
                      //envio para el trabajo, habilitar_envio: true

                      if (rsta == 1) {
                        //despues de realizar la validacion del plano y la carga con su transformacion, se debera responder a la vista
                        //validando que la transformacion se ha ejecutado con EXITO cod_estado = o

                        req.flash(
                          "notify",
                          "El Archivo Plano " +
                            nombre_plano +
                            " fue validado correctamente..."
                        );
                        res.json({
                          respuesta: "OK",
                          status: 200,
                          habilitar_envio: true,
                          habilitar_elim_all: habilita_eliminar_todos,
                          descripcion:
                            "El plano " +
                            nombre_plano +
                            " fue validado correctamente...",
                        });
                        // } else {
                        // console.error("Ocurrio un problema con la ejecucion del comando/tranformacion_ rspta de retorno: ");
                        //}
                      } else {
                        //despues de realizar la validacion del plano y la carga con su transformacion, se debera responder a la vista
                        //validando que la transformacion se ha ejecutado con EXITO
                        //Se debe validar la respuesta

                        req.flash(
                          "notify",
                          "El Archivo Plano " +
                            nombre_plano +
                            " fue validado correctamente..."
                        );
                        res.json({
                          respuesta: "OK",
                          status: 200,
                          habilitar_envio: false,
                          habilitar_elim_all: habilita_eliminar_todos,
                          descripcion:
                            "El plano " +
                            nombre_plano +
                            " fue validado correctamente...",
                        });
                        // }else {
                        //console.error("Ocurrio un problema con la ejecucion del comando/tranformacion_ rspta de retorno: " );
                        //}
                      }
                    });
                });
              } else {
                req.flash(
                  "error",
                  "El Archivo Plano " +
                    nombre_plano +
                    "No se logro actualizar en BD, error actualizando, validado NO"
                );
                res.json({
                  error: 500,
                  respuesta:
                    "El Archivo Plano " +
                    nombre_plano +
                    " tiene los siguientes errores:" +
                    rsta_validacion,
                });
              }
            })
            .catch((err) => {
              return res.status(500).send("Error obteniendo registros");
            });
        } else {
          //si la respuesta de validacion NO esta vacia, se retornan los errores encontrados

          req.flash(
            "error",
            "El Archivo Plano " +
              nombre_plano +
              " tiene los siguientes errores:" +
              rsta_validacion
          );
          res.json({
            error: 500,
            respuesta:
              "El Archivo Plano " +
              nombre_plano +
              " tiene los siguientes errores:" +
              rsta_validacion,
          });
        }
      });
  }
);




router.post(
  "/enviar-trabajo/ejecucion/archivo-bips",
  authMiddleware,
  (req, res) => {
    //RETORNA  O CUANDO TERMINA EL TRABAJO EXITOSO

    //Se realiza el llamado de la funcion que permite ejecutar el trabajo con la herramienta kitchen de spoon
    //modelktr.ejecucionJob().then(rsta => console.log("La respuesta de ejecucion del trabajo es "+rsta));

    const path = require("path");
    const fs = require("fs");
    const spawn = require("child_process").spawn;

    const spawn_job = spawn("sh", [
      "/var/lib/PENTAHO_/data-integration/kitchen.sh",
      "-file=src/integracionKjb/Job_reporte2193.kjb",
      "-level=Basic",
      "-logfile=/tmp/trans.log",
    ]);

    spawn_job.stdout.pipe(process.stdout);

    spawn_job.stdout.on("data", (data) => {});
    spawn_job.stderr.on("data", (data) => {
      //console.error(`stderr: ${data}`);
    });
    //res.send(stdout);

    spawn_job.on("close", (code) => {
      if (code == "0") {
        //res.send(code);

        //res.status(200).send(code.toString());
        modelplanos.ObtenerPlanos_validos().then((rsta) => {
          var cont = rsta.length;
          var bandera = false;

          rsta.forEach((plano) => {
            ruta = plano["path_plano"];

            try {
              //var ruta = path.join(__dirname, 'filesBipsUploads') + '/' + file;
              fs.unlinkSync(ruta, function (err) {
                if (err) {
                  bandera = true;
                  return console.error(err);
                }
              });
            } catch (error) {
              console.error(
                "Something wrong hrouterened removing the file",
                error
              );
            }
          });

          if (!bandera) {
            modelplanos
              .eliminar_all_RegistrosPlanos_tmp_validos()
              .then((rsta_elim) => {
                if (
                  rsta_elim["command"] == "DELETE" &&
                  rsta_elim["rowCount"] > 0
                ) {
                  req.flash(
                    "notify",
                    "informacion fue cargada exitosamente..."
                  );
                  res.json({
                    respuesta: "OK",
                    status: 200,
                    retorno: code.toString(),
                    descripcion: "El trabajo se ejecuto con exito... ",
                  });
                }
              });
          }
        });
      } else {
        res.status(200).send(code.toString());
        console.error(
          "Ocurrio un problema con la ejecucion del comando/job CODE:" + code
        );
      }
    });
  }
);

router.post(
  "/enviar-carga/ejecucion-multiple/archivo-bips",
  authMiddleware,
  (req, res) => {
    //llamado de la transformacion que envia los datos de los archivos planos tmp a las tablas de los planos
    //modelktr.selecionaKtr(name_tmp,nombre_plano);
    //buscar en bd el plano que llega como parametro y obtener el path del plano para pasar a la transformacion,
    //se debe verficar que el plano este validado

    //buscar en bd el plano que llega como parametro y obtener el path del plano para pasar a la transformacion,
    //se debe verficar que el plano este validado
    var path_plano_AF = "";
    var path_plano_AN = "";
    var path_plano_AM = "";
    var path_plano_AT = "";
    var path_plano_AC = "";
    var path_plano_AU = "";
    var path_plano_US = "";
    var path_plano_AH = "";
    var path_plano_CT = "";
    var path_plano_AP = "";

    var cont = 0;

    var spawn = require("child_process").spawn;

    modelplanos.ObtenerPlanos_validos().then((rsta) => {
      rsta.forEach((plano) => {
        if (plano["validado"] == true) {
          if (plano["nombre_original"].slice(0, 2) == "AF") {
            path_plano_AF = plano["path_plano"];
            cont++;
          } else if (plano["nombre_original"].slice(0, 2) == "AP") {
            path_plano_AP = plano["path_plano"];
            cont++;
          } else if (plano["nombre_original"].slice(0, 2) == "AC") {
            path_plano_AC = plano["path_plano"];
            cont++;
          } else if (plano["nombre_original"].slice(0, 2) == "AT") {
            path_plano_AT = plano["path_plano"];
            cont++;
          } else if (plano["nombre_original"].slice(0, 2) == "AH") {
            path_plano_AH = plano["path_plano"];
            cont++;
          } else if (plano["nombre_original"].slice(0, 2) == "CT") {
            path_plano_CT = plano["path_plano"];
            cont++;
          } else if (plano["nombre_original"].slice(0, 2) == "US") {
            path_plano_US = plano["path_plano"];
            cont++;
          } else if (plano["nombre_original"].slice(0, 2) == "AM") {
            path_plano_AM = plano["path_plano"];
            cont++;
          } else if (plano["nombre_original"].slice(0, 2) == "AN") {
            path_plano_AN = plano["path_plano"];
            cont++;
          } else if (plano["nombre_original"].slice(0, 2) == "AU") {
            path_plano_AU = plano["path_plano"];
            cont++;
          }
        } else {
          return 1;
        }
      });

      if (cont == 10) {
        /*
                  La función spawn lanza un comando en un nuevo proceso y podemos usarlo para pasarle cualquier argumento a ese comando
          
                  */
        //let spawn_trs = spawn('sh', ['/var/lib/data-integration/pan.sh', "-file=src/IntegracionKtr/" + nombre_transformacion, '-level=Basic', "-param:ruta_archivo_af=" + path_plano_AF, '-logfile=/tmp/trans.log']);
        var spawn_trs = spawn("sh", [
          "/var/lib/PENTAHO_/data-integration/pan.sh",
          "-file=src/IntegracionKtr/tras-all-Planos.ktr",
          "-level=Detailed",
          "-param:ruta_archivo_af=" + path_plano_AF,
          "-param:ruta_archivo_ac=" + path_plano_AC,
          "-param:ruta_archivo_at=" + path_plano_AT,
          "-param:ruta_archivo_an=" + path_plano_AN,
          "-param:ruta_archivo_am=" + path_plano_AM,
          "-param:ruta_archivo_ap=" + path_plano_AP,
          "-param:ruta_archivo_ct=" + path_plano_CT,
          "-param:ruta_archivo_us=" + path_plano_US,
          "-param:ruta_archivo_au=" + path_plano_AU,
          "-param:ruta_archivo_ah=" + path_plano_AH,

          "-logfile=/tmp/trans.log",
        ]);

        //const spawn_trs = spawn('ls',['-ltr','/var/lib/data-integration']);

        //const spawn_trs = spawn('ls', ['-ltr']);

        //la opcion pipe canaliza spawn_trs.stdout directamente a process.stdout
        spawn_trs.stdout.pipe(process.stdout);

        spawn_trs.stdout.setEncoding("utf8");

        spawn_trs.stderr.setEncoding("utf8");

        //Con los flujos legibles, podemos escuchar el evento de datos, que tendrá la
        //salida del comando o cualquier error encontrado al ejecutar el comando
        spawn_trs.stdout.on("data", (data) => {
          console.log(`stdout:\n${data}`);
        });
        spawn_trs.stderr.on("data", (data) => {
          // console.error(`stderr: ${data}`);
        });

        spawn_trs.on("close", (code) => {

          if (code == 0) {

            modelplanos.actualizar_carga_temp().then((respuesta) => {
              if (
                respuesta["command"] == "UPDATE" &&
                respuesta["rowCount"] > 0
              ) {
     
              }
            });


            modelplanos
              .consultar_RegistrosPlanos_tmp()
              .then((listaArchivos) => {
    
                req.flash(
                  "notify",
                  "La carga de los Planos se realizo con exito..."
                );
       
                res.render("paginas/listaArchivos", {
                  arr_files: listaArchivos,
                  habilitar_envio_la: true,
                  habilitar_carga: false,
                  habilitar_eliminar: false,
                  habilitar_btn_envio: true,
                  status: 200,
                  code: 0,
                  retorno: "0",
                });
              })
              .catch((err) => {
                console.log(err);
                return res.status(500).send("Error obteniendo registros");
              });

  
          } else {
            console.error(
              "Ocurrio un problema con la ejecucion del comando/transformacion " +
                code
            );
            //se retorna el codigo de estado de errro
            //return 1;
            req.flash(
              "error",
              "Ocurrio un error en la carga de los planos, Contacte con el administrador... Cod.Transformacion: " +
                code
            );
            modelplanos
              .consultar_RegistrosPlanos_tmp()
              .then((listaArchivos) => {
                res.render("paginas/listaArchivos", {
                  arr_files: listaArchivos,
                  habilitar_envio_la: true,
                  habilitar_carga: true,
                  habilitar_eliminar: false,
                  habilitar_btn_envio: false,
                  status: 200,
                  code: code,
                  retorno: "0",
                });
              });
          }
        });

        spawn_trs.on("exit", (code) => {
        });
      }

      //});
    });
  }
);



router.get("/config-user-bips", authMiddleware, (req, res) => {
  res.render("paginas/config_user", {
    user: req.session.username["nombre"],
    rol: req.session.username["rol"],
    area: req.session.username["nombre_area"],
  });
});

router.get("/config-perfil-bips", authMiddleware, (req, res) => {
  res.render("paginas/config_perfil", {
    user: req.session.user,
    area: req.session.username["nombre_area"],
  });
});

router.get("/file-view-pdf", authMiddleware, (req, res) => {
  var url = path.join(
    __dirname + "/" + "filesBipsUploads/" + "example_pdf.pdf"
  );
  res.send("ok", { user: req.session.user, url: url });
});

router.get("/gestion-bips", authMiddleware, (req, res) => {
  res.render("paginas/gestion", { user: req.session.user });
});

router.get("/estado-cartera-bips", authMiddleware, (req, res) => {
  res.render("paginas/estado_cartera", { user: req.session.user });
});

router.get("/estado-recaudo-bips", authMiddleware, (req, res) => {
  res.render("paginas/estado_recaudo", { user: req.session.user });
});


router.get("/menu-ctm", authMiddleware, (req, res) => {

  res.render("paginas/menu_cuadro_mando", {
    nombre_rol: req.session.username["nombre_rol"],
    rol: req.session.username["rol"],
    permisos: req.session.username["permisos"],
  });
});



router.get("/ctm-areas", authMiddleware, (req, res) => {
  res.render("paginas/ctm_areas");
});

router.get("/lista-ctm-areas", authMiddleware, (req, res) => {
  modelControlMando.consultar_RegistroAreas().then((lista_areas) => {
    res.render("paginas/lista_ctm_areas", { lista_areas: lista_areas });
  });
});







router.post("/form-editar-ctm-plan-accion", authMiddleware, (req, res) => {
  console.log("id_plan:" + req.query.id_plan);
  modelControlMando
    .consultar_plan_accion_x_id(req.query.id_plan)
    .then((plan_accion_info) => {
      modelControlMando
        .consultar_RegistrosPlan_General()
        .then((listaPlanes_grales) => {
          modelControlMando
            .consultar_RegistrosLineasAccion()
            .then((lineas_accion) => {
              res.render("paginas/editar_plan_accion", {
                id_plan: req.query.id_plan,
                planes_generales: listaPlanes_grales,
                plan_accion_info: plan_accion_info,
                lineas_accion: lineas_accion,
              });
            });
        });
    });
});

router.post("/form-editar-ctm-indicador", authMiddleware, (req, res) => {
  console.log("id_indicador:" + req.query.id_indicador);
  //console.log('id_area:' + req.query.id_area);
  modelControlMando
    .consultar_indicadores_x_id(req.query.id_indicador)
    .then((indicador_info) => {
      modelControlMando
        .consultar_RegistrosPlan_General()
        .then((listaPlanes_grales) => {
          modelControlMando
            .consultar_RegistrosLineasAccion()
            .then((lineas_accion) => {
              modelControlMando
                .consultar_RegistroPlanes()
                .then((lista_plan_accion) => {
                  res.render("paginas/editar_indicador", {
                    id_indicador: req.query.id_indicador,
                    id_plan_accion: req.query.id_plan,
                    planes_generales: listaPlanes_grales,
                    indicador_info: indicador_info,
                    lineas_accion: lineas_accion,
                    lista_plan_accion: lista_plan_accion,
                  });
                });
            });
        });
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
  //console.log(req.query);
  //console.log(req.params);
  //console.log(req.body);

  modelControlMando
    .consultar_EstartegiasXobetivo(req.query.id_objetivo)
    .then((lista_Estrategias) => {
      //console.log(lista_planes);
      //res.render("paginas/ctm_objetivos", { user: req.session.user,listaPlanes_grales: listaPlanes_grales, lista_lineas_accion: lista_lineas_accion });
      res.send(lista_Estrategias);
    });
});

router.get(
  "/consultar-plan-accion-x-estrategia",
  authMiddleware,
  (req, res) => {
    //console.log(req.query);
    //console.log(req.params);
    //console.log(req.body);

    modelControlMando
      .consultar_PlanesXestrategia(req.query.id_estrategia)
      .then((lista_Planes) => {
        //console.log(lista_planes);
        //res.render("paginas/ctm_objetivos", { user: req.session.user,listaPlanes_grales: listaPlanes_grales, lista_lineas_accion: lista_lineas_accion });
        res.send(lista_Planes);
      });
  }
);


router.get("/ctm-estrategias", authMiddleware, (req, res) => {
  //console.log(req.query.linea_accion);
  modelControlMando
    .consultar_RegistrosPlan_General()
    .then((listaPlanes_grales) => {
      //console.log(lista_planes);
      res.render("paginas/ctm_estrategias", {
        user: req.session.user,
        listaPlanes_grales: listaPlanes_grales,
      });
    });
});

router.get("/listado-ctm-estrategias", authMiddleware, (req, res) => {
  modelControlMando
    .consultar_RegistrosEstrategias()
    .then((lista_Estrategias) => {
      //console.log(lista_planes);
      res.render("paginas/lista_ctm_estrategias", {
        lista_Estrategias: lista_Estrategias,
      });
    });
});

router.post("/actualizar-plan-accion", authMiddleware, (req, res) => {
  modelControlMando
    .actualizar_plan_accion_x_id(
      req.query.id_plan,
      req.query.plan,
      req.query.id_estrategia
    )
    .then((respuesta) => {
      console.log(respuesta);
      if (respuesta["command"] == "UPDATE" && respuesta["rowCount"] > 0) {
        console.log("OK... update plan de accion");
        res.send({
          status: 200,
          msg:
            "El plan de accion " +
            req.query.plan +
            " fue actualizado correctamente...",
        });
      } else {
        res.send({
          status: 300,
          msg:
            "ERROR al actualizar el plan de accion <b>" +
            req.query.plan +
            "</b> " +
            " intente de nuevo...",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' Ya existe...');
      res.json({
        status: 500,
        msg:
          "ERROR!! El plan de accion  <b>" +
          req.query.plan +
          "</b>, " +
          +"NO se pudo actualizar...",
      });
    });
});

router.post("/form-editar-ctm-estrategia", authMiddleware, (req, res) => {
  modelControlMando
    .consultar_RegistroEstrategia_x_id(req.query.id_estrategia)
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
                  res.render("paginas/editar_estrategia", {
                    id_estrategia: req.query.id_estrategia,
                    planes_generales: listaPlanes_grales,
                    estrategia_info: estrategia_info,
                    lineas_accion: lineas_accion,
                    lista_objetivos: lista_objetivos,
                  });
                  //res.render("paginas/ctm_objetivos", { user: req.session.user, listaPlanes_grales: listaPlanes_grales });
                });
            });
        });
    });
});

router.post("/actualizar-indicador", authMiddleware, (req, res) => {
  modelControlMando
    .actualizar_indicador(
      req.query.id_indicador,
      req.query.nombre_indicador,
      req.query.id_plan_accion,
      req.query.id_area,
      req.query.tipo_meta,
      req.query.formula_literal_descriptiva,
      req.query.meta_descriptiva,
      req.query.meta_numerica,
      req.query.formula_literal_numerador,
      req.query.formula_literal_denominador,
      Number(req.query.periodo_evaluacion)
    )
    .then((respuesta) => {
      console.log(respuesta);
      if (respuesta["command"] == "UPDATE" && respuesta["rowCount"] > 0) {
        console.log("OK... update indicador");
        res.send({
          status: 200,
          msg:
            "El indicador " +
            req.query.nombre_indicador +
            " fue actualizado correctamente...",
        });
      } else {
        res.send({
          status: 300,
          msg:
            "ERROR al actualizar el indicador <b>" +
            req.query.nombre_indicador +
            "</b> " +
            " intente de nuevo...",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' Ya existe...');
      res.json({
        status: 500,
        msg:
          "ERROR!! El indicador " +
          req.query.nombre_indicador +
          "NO se pudo actualizar...",
      });
    });
});

router.post("/actualizar-estrategia", authMiddleware, (req, res) => {
  //res.send("OK");
  console.log(req.query);
  console.log(req.params);
  console.log(req.body);
  modelControlMando
    .actualizar_RegistroEstrategia_x_id(
      req.query.id_estrategia,
      req.query.id_objetivo,
      req.query.estrategia
    )
    .then((respuesta) => {
      console.log(respuesta);
      if (respuesta["command"] == "UPDATE" && respuesta["rowCount"] > 0) {
        console.log("OK... update Estrategia OK");
        //console.log(listaArchivos);
        //req.flash('notify', 'La carga de los Planos se realizo con exito...');
        //res.setHeader('Content-type', 'text/html');
        //req.flash('notify', 'La linea de acción' + req.query.linea_accion + ',' + ' se actualizo correctamente...');

        res.send({
          status: 200,
          msg:
            "La Estrategia " +
            req.query.estrategia +
            " fue actualizada correctamente...",
        });
        //res.render("/config-entidades");
      } else {
        //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' intente de nuevo...');
        res.send({
          status: 300,
          msg:
            "ERROR al actualizar La Estrategia " +
            req.query.estrategia +
            " intente de nuevo...",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' Ya existe...');
      res.json({
        status: 500,
        msg:
          "ERROR!! La Estrategia " +
          req.query.estrategia +
          " NO se pudo actualizar...",
      });
    });
});

///eliminar-popup-estrategia/

router.get(
  "/eliminar-popup-estrategia/:id_estrategia/control-mando-bips",
  authMiddleware,
  (req, res) => {
    // console.log(req.query);
    //console.log(req.params);
    //var name = req.query.;

    let params = [req.params.id_estrategia, req.query.nombre_estrategia];
    res.render(
      path.join(__dirname + "/src/vista/paginas/popup-eliminar-estrategia"),
      { datos_estrategia: params }
    );
  }
);

router.post(
  "/estrategia/delete/:id/control-mando-bips",
  authMiddleware,
  function (req, res) {
    console.log(req.query);
    console.log(req.params);
    var msg = "";

    modelControlMando
      .eliminar_RegistroEstrategia(req.params.id)
      .then((respuesta) => {
        if (respuesta["command"] == "DELETE" && respuesta["rowCount"] > 0) {
          console.log(
            "respuesta de eliminacion: 1, Se elimino correctamente la estrategia..."
          );
          msg =
            "La estrategia " +
            req.query.nombre_estrategia +
            " se eliminó correctamente...";
        } else {
          console.log(
            "respuesta de eliminacion: ERROR... 0, ocurrio un problema al eliminar La estrategia " +
              req.query.nombre_estrategia
          );
          msg =
            " ocurrio un problema al eliminar la Estrategia... " +
            req.query.nombre_estrategia;
        }
        req.flash("notify_del_estrategia", msg);
        res.redirect("/listado-ctm-estrategias");
      });
  }
);

router.get("/ctm-planes", authMiddleware, (req, res) => {
  modelControlMando
    .consultar_RegistrosPlan_General()
    .then((listaPlanes_grales) => {
      res.render("paginas/ctm_planes", {
        user: req.session.user,
        listaPlanes_grales: listaPlanes_grales,
      });
    });
});

router.get("/listado-ctm-planes", authMiddleware, (req, res) => {
  modelControlMando.consultar_RegistroPlanes().then((lista_Planes) => {
    res.render("paginas/lista_ctm_planes", { lista_Planes: lista_Planes });
  });
});

router.get(
  "/eliminar-popup-plan-accion/:id_plan_accion/control-mando-bips",
  authMiddleware,
  (req, res) => {
    // console.log(req.query);
    //console.log(req.params);
    //var name = req.query.;

    let params = [
      req.params.id_plan_accion,
      req.query.nombre_plan_accion,
      req.query.id_estrategia,
    ];
    res.render(
      path.join(__dirname + "/src/vista/paginas/popup-eliminar-plan-accion"),
      { datos_plan: params }
    );
  }
);

router.post(
  "/plan-accion/delete/:id_plan/control-mando-bips",
  authMiddleware,
  function (req, res) {
    console.log(req.query);
    console.log(req.params.id_estrategia);
    var msg = "";

    modelControlMando
      .consultar_PlanesXestrategia(req.params.id_estrategia)
      .then((rspta_eliminacion) => {
        console.log(rspta_eliminacion);
        if (rspta_eliminacion.length == 0) {
          modelControlMando
            .eliminar_plan_accion(req.params.id_plan)
            .then((respuesta) => {
              msg =
                "El plan general " +
                req.query.nombre_plan +
                " se eliminó correctamente...";
              if (
                respuesta["command"] == "DELETE" &&
                respuesta["rowCount"] > 0
              ) {
                console.log(
                  "respuesta de eliminacion: 1, Se elimino correctamente el plan de accion..."
                );
                msg =
                  "El plan de accion " +
                  req.query.nombre_plan +
                  " se eliminó correctamente...";
              } else {
                console.log(
                  "respuesta de eliminacion: ERROR... 0, ocurrio un problema al eliminar el plan general " +
                    req.query.nombre_plan
                );
                msg =
                  " ocurrio un problema al eliminar el plan de accion... " +
                  req.query.nombre_plan;
              }
            });
        } else {
          msg =
            "El plan de accion " +
            req.query.nombre_plan +
            " NO  se puede Eliminar, tiene asociada una estrategia...";
        }

        req.flash("notify_del_plangral", msg);
        //res.json({ status: 200, msg });
        res.redirect("/lista-ctm-planes");
      });
  }
);

router.get("/consultar-tipometa-area-x-plan", authMiddleware, (req, res) => {
  modelControlMando
    .consultar_tipometaxidplan(req.query.id_plan)
    .then((lista_tipo_meta) => {
      res.send(lista_tipo_meta);
    });
});

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

router.get("/ctm-indicadores", authMiddleware, (req, res) => {
  modelControlMando
    .consultar_RegistrosPlan_General()
    .then((listaPlanes_grales) => {
      modelControlMando.consultar_RegistroAreas().then((lista_areas) => {
        res.render("paginas/ctm_indicadores", {
          user: req.session.user,
          listaPlanes_grales: listaPlanes_grales,
          lista_areas: lista_areas,
        });
      });
    });
});




router.get(
  "/consultar-vigencia-anio-profesional",
  authMiddleware,
  (req, res) => {
    //console.log(req.query.año);
    modelControlMando
      .consultar_vigencia_año(
        Number(req.query.profesional),
        Number(req.query.indicador)
      )
      .then((lista_años) => {
        res.send(lista_años);
      });
  }
);

router.get("/ctm-calificacion-indicadores", authMiddleware, (req, res) => {
  modelControlMando.consultar_vigenciaxreg_indicadores().then((lista_años) => {
    res.render("paginas/ctm_calificacion_indicadores", {
      user: req.session.user,
      lista_años: lista_años,
    });
  });
});

router.get("/consultar-periodo-x-anio", authMiddleware, (req, res) => {
  //console.log(req.query.año);
  modelControlMando
    .consultar_periodoxaño(
      req.query.año,
      req.query.area,
      req.query.profesional,
      req.query.indicador
    )
    .then((lista_periodo) => {
      res.send(lista_periodo);
    });
});

router.get(
  "/consultar-periodo-x-anio-calificacion",
  authMiddleware,
  (req, res) => {
    modelControlMando
      .consultar_periodoxaño_calificacion(req.query.año)
      .then((lista_periodo) => {
        res.send(lista_periodo);
      });
  }
);

router.get(
  "/consultar-area-x-periodo-calificacion",
  authMiddleware,
  (req, res) => {
    //console.log('periodo'+req.query.periodo);
    //console.log('vigencia'+req.query.vigencia);

    modelControlMando
      .consultar_areaxperiodo_calificacion(
        req.query.periodo,
        req.query.vigencia
      )
      .then((lista_area) => {
        //console.log('lista_area'+lista_area);
        res.send(lista_area);
      });
  }
);

router.get("/consultar-profesional-x-area", authMiddleware, (req, res) => {
  // console.log(req.query.area);
  modelControlMando
    .consultar_profesionalxarea(req.query.area)
    .then((lista_profesional) => {
      res.send(lista_profesional);
    });
});

router.get("/consultar-indicador-x-periodo", authMiddleware, (req, res) => {
  //console.log('id_area:' + req.query.area);
  //console.log('VIGENCIA:' + req.query.vigencia);
  //console.log('PERIODO:' + req.query.periodo);

  modelControlMando
    .consultar_indicadorxperiodo(
      req.query.area,
      req.query.vigencia,
      req.query.periodo
    )
    .then((lista_indicadores) => {
      res.send(lista_indicadores);
    });
});

router.get("/validacion-insert-reg-indicadores", authMiddleware, (req, res) => {
  //console.log('id_area:' + req.query.area);
  //console.log('VIGENCIA:' + req.query.vigencia);
  //console.log('PERIODO:' + req.query.periodo);

  modelControlMando
    .validacion_insert_reg_indicadores(
      req.query.vigencia,
      req.query.periodo,
      req.query.area,
      req.query.indicador,
      req.query.profesional
    )
    .then((validacion) => {
      var bandera = false;
      if (validacion.length == 0) {
        //res.send(bandera, validacion);
        res.send({ status: 200, bandera: bandera });
      } else {
        bandera = true;
        //res.send(bandera, validacion);
        console.log(validacion);
        res.send({
          status: 200,
          msg: "El profesional ya tiene registrado este indicador en este periodo",
          datos: validacion,
          bandera: bandera,
        });
      }
    });
});

router.get(
  "/validacion-insert-respuesta-indicadores",
  authMiddleware,
  (req, res) => {
    //console.log('id_area:' + req.query.area);
    //console.log('VIGENCIA:' + req.query.vigencia);
    //console.log('PERIODO:' + req.query.periodo);

    modelControlMando
      .validacion_insert_respuesta_indicadores(
        req.query.vigencia,
        req.query.periodo,
        req.query.indicador,
        req.query.profesional
      )
      .then((validacion) => {
        var bandera = false;
        if (validacion.length == 0) {
          //res.send(bandera, validacion);
          res.send({ status: 200, bandera: bandera });
        } else {
          bandera = true;
          //res.send(bandera, validacion);
          console.log(validacion);
          res.send({
            status: 200,
            msg: "El profesional ya tiene registrado este indicador en este periodo pendiente por calificar",
            datos: validacion,
            bandera: bandera,
          });
        }
      });
  }
);


router.get("/lista-ctm-reg-ind-xcal-filtrado", authMiddleware, (req, res) => {
  //select a.id_registroindicador, a.vigencia, e.nombre_mes, b.id_indicador, b.nombre_indicador, u.num_identificacion, concat(u.nombre, ' ', u.apellido) as nombre_profesional from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (u.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) where a.vigencia = $1 and e.id_mes = $2 and d.id_area = $3 order by a.id_registroindicador
  //console.log(req.query)
  modelControlMando
    .consultar_reg_ind_xcal_filtrado(
      req.query.vigencia,
      req.query.periodo,
      req.query.area,
      req.query.indicador
    )
    .then((lista_reg_indicadores) => {
      //console.log(lista_Estrategias);lista_Estrategias
      //res.setHeader('Content-type', 'text/html');
      //res.send(lista_reg_indicadores);
      res.render("paginas/lista_ctm_ind_xcal_filtrados", {
        lista_calificacion_indicadores: lista_reg_indicadores,
      });
    });
});

router.get("/lista-ctm-reg-ind-xcal", authMiddleware, (req, res) => {
  //select a.id_registroindicador, a.vigencia, e.nombre_mes, b.id_indicador, b.nombre_indicador, u.num_identificacion, concat(u.nombre, ' ', u.apellido) as nombre_profesional from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (u.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) where a.vigencia = $1 and e.id_mes = $2 and d.id_area = $3 order by a.id_registroindicador
  //console.log(req.query)
  modelControlMando
    .consultar_reg_ind_xcalificar()
    .then((lista_reg_indicadores) => {
      //console.log(lista_Estrategias);lista_Estrategias
      //res.setHeader('Content-type', 'text/html');
      //res.send(lista_reg_indicadores);
      res.render("paginas/lista_ctm_ind_xcal_filtrados", {
        lista_calificacion_indicadores: lista_reg_indicadores,
      });
    });
});

router.get("/obtener_soportesxreg_indicador", authMiddleware, (req, res) => {
  //select a.id_registroindicador, a.vigencia, e.nombre_mes, b.id_indicador, b.nombre_indicador, u.num_identificacion, concat(u.nombre, ' ', u.apellido) as nombre_profesional from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (u.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) where a.vigencia = $1 and e.id_mes = $2 and d.id_area = $3 order by a.id_registroindicador
  console.log(req.query);
  modelControlMando
    .consultar_soportes_x_regIndicador(req.query.id_reg_indicador)
    .then((lista_soportes) => {
      console.log(lista_soportes);

      res.render("paginas/lista_ctm_soportes", {
        lista_soportes: lista_soportes,
      });
    });
});
///descargar-recurso-soporte
router.get(
  "/descargar-recurso-soporte/:id_soporte",
  authMiddleware,
  (req, res) => {
    //select a.id_registroindicador, a.vigencia, e.nombre_mes, b.id_indicador, b.nombre_indicador, u.num_identificacion, concat(u.nombre, ' ', u.apellido) as nombre_profesional from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (u.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) where a.vigencia = $1 and e.id_mes = $2 and d.id_area = $3 order by a.id_registroindicador
    //console.log(req.query)
    const spawn = require("child_process").spawn;

    modelControlMando
      .consultar_soporte(req.params.id_soporte)
      .then((lista_soportes) => {
        console.log("" + lista_soportes[0].ruta_digital);
        //const spawn_cp = spawn('cmd.exe', ['/c', "C://test.bat"], { shell: true }, { stdio: 'inherit' });
        const spawn_cp = spawn("cmd.exe", [
          "/c",
          "C://test.bat",
          lista_soportes[0].ruta_digital,
          path.join(__dirname, "filesBipsUploads"),
        ]);

        spawn_cp.stdout.on("data", (data) => {
          console.log("std OUT");
          console.log(data.toString());
        });
        spawn_cp.stderr.on("data", (data) => {
          console.log("std ERR");
          console.error(data.toString());
        });
        //res.send(stdout);

        spawn_cp.on("close", (code) => {
          console.log("OK.. code: " + code);
          var preText = `Child exited with code ${code} : `;
          switch (code) {
            case 1:
              console.info(
                preText + "El comando BATCH se ejecuto correctamente..."
              );

              console.log(lista_soportes);
              var file = fs.readFileSync(
                path.join(
                  __dirname,
                  "/filesBipsUploads/",
                  lista_soportes[0].nombre_soporte
                ),
                "binary"
              );

              //res.download(path.join(__dirname, "/filesBipsUploads/", lista_soportes[0].nombre_soporte));
              //res.setHeader('Content-Length', 10000000000000000);
              res.setHeader(
                "Content-disposition",
                "attachment; filename=" + lista_soportes[0].nombre_soporte
              );
              res.setHeader("Content-Type", lista_soportes[0].mime_type);

              res.write(file, "binary");
              res.end();

              break;
            case 2:
              console.info(preText + "The file already exists");
              break;
            case 3:
              console.info(
                preText + "The file doesn't exists and now is created"
              );
              break;
            case 4:
              console.info(
                preText + "An error ocurred while creating the file"
              );
              break;
          }
        });
      });
  }
);

router.get(
  "/eliminar-recurso-soporte/:id_soporte",
  authMiddleware,
  (req, res) => {
    const spawn = require("child_process").spawn;
    modelControlMando
      .consultar_soporte(req.params.id_soporte)
      .then((lista_soportes) => {
        modelControlMando
          .eliminar_soporte_x_idSoporte(req.params.id_soporte)
          .then((rspta_eliminacion) => {
            msg =
              "El Soporte " +
              lista_soportes[0].nombre_original +
              " se eliminó correctamente...";
            if (
              rspta_eliminacion["command"] == "DELETE" &&
              rspta_eliminacion["rowCount"] > 0
            ) {
              console.log(
                "respuesta de eliminacion: 1, Se elimino correctamente el soporte..."
              );
              msg =
                "El Soporte " +
                lista_soportes[0].nombre_original +
                " se eliminó correctamente...";

              //se elimina el soporte (digital) del directorio
              const spawn_del = spawn("cmd.exe", [
                "/c",
                "C://task_delete_file.bat",
                dir_soportes_ctm,
                lista_soportes[0].nombre_soporte,
              ]);

              spawn_del.stdout.on("data", (data) => {
                console.log("std OUT");
                console.log(data.toString());
              });
              spawn_del.stderr.on("data", (data) => {
                console.log("std ERR");
                console.error(data.toString());
              });
              //res.send(stdout);

              spawn_del.on("close", (code) => {
                console.log("OK.. code: " + code);
                var preText = `Child exited with code ${code} : `;
                switch (code) {
                  case 1:
                    req.flash("notify_del_soporte", msg);
                    res.send({ status: 200, msg: msg });
                    break;
                  case 2:
                    console.info(preText + "The file already exists");
                    break;
                  case 3:
                    console.info(
                      preText + "The file doesn't exists and now is created"
                    );
                    break;
                  case 4:
                    console.info(
                      preText + "An error ocurred while creating the file"
                    );
                    break;
                }
              });
            } else {
              console.log(
                "respuesta de eliminacion: ERROR... 0, ocurrio un problema al eliminar el Soporte " +
                  lista_soportes[0].nombre_original
              );
              msg =
                " ocurrio un problema al eliminar el soporte... " +
                lista_soportes[0].nombre_original;
              req.flash("notify_del_soporte", msg);
              res.send({ status: 300 });
            }
          });
      });
  }
);

router.get(
  "/eliminar-recurso-temporal/:tipo/:nombre_archivo",
  authMiddleware,
  (req, res) => {
    const spawn = require("child_process").spawn;
    var spawn_del = "";

    msg =
      "El Soporte temp  " +
      req.params.nombre_archivo +
      " se eliminó correctamente...";

    console.log(
      "respuesta de eliminacion: 1, Se elimino correctamente el soporte temp despues de descargar ..."
    );
    msg =
      "El Soporte temp" +
      req.params.nombre_archivo +
      " se eliminó correctamente despues de descargar...";

    //se elimina el soporte (digital) del directorio
    //tipo 1 = DESCARGA
    //tipo 2 = VISUALIZACION
    if ((req.params.tipo = 1)) {
      console.log("el archivo es accion tipo 1= DESCARGAR");
      spawn_del = spawn("cmd.exe", [
        "/c",
        "C://task_delete_file.bat",
        path.join(__dirname, "filesBipsUploads"),
        req.params.nombre_archivo,
      ]);
    } else if ((req.params.tipo = 2)) {
      console.log("el archivo es accion tipo 2= VISUALIZACION");
      spawn_del = spawn("cmd.exe", [
        "/c",
        "C://task_delete_file.bat",
        dir_soportes_ctm,
        req.params.nombre_archivo,
      ]);
    }

    spawn_del.stdout.on("data", (data) => {
      console.log("std OUT");
      console.log(data.toString());
    });
    spawn_del.stderr.on("data", (data) => {
      console.log("std ERR");
      console.error(data.toString());
    });
    //res.send(stdout);

    spawn_del.on("close", (code) => {
      console.log("OK.. code: " + code);
      var preText = `Child exited with code ${code} : `;
      switch (code) {
        case 1:
          req.flash("notify_del_soporte", msg);
          res.send({ status: 200, msg: msg });
          break;
        case 2:
          console.info(preText + "The file already exists");
          break;
        case 3:
          console.info(preText + "The file doesn't exists and now is created");
          break;
        case 4:
          console.info(preText + "An error ocurred while creating the file");
          break;
      }
    });
  }
);

router.get("/ver-recurso-soporte/:id_soporte", authMiddleware, (req, res) => {
  //select a.id_registroindicador, a.vigencia, e.nombre_mes, b.id_indicador, b.nombre_indicador, u.num_identificacion, concat(u.nombre, ' ', u.apellido) as nombre_profesional from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (u.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) where a.vigencia = $1 and e.id_mes = $2 and d.id_area = $3 order by a.id_registroindicador
  //console.log(req.query)
  const spawn = require("child_process").spawn;

  modelControlMando
    .consultar_soporte(req.params.id_soporte)
    .then((lista_soportes) => {
      console.log("" + lista_soportes[0].ruta_digital);
      //const spawn_cp = spawn('cmd.exe', ['/c', "C://test.bat"], { shell: true }, { stdio: 'inherit' });
      const spawn_cp = spawn("cmd.exe", [
        "/c",
        "C://test.bat",
        lista_soportes[0].ruta_digital,
        path.join(__dirname, "/pdf.js/web/filespublic/"),
      ]);

      spawn_cp.stdout.on("data", (data) => {
        console.log("std OUT");
        console.log(data.toString());
      });
      spawn_cp.stderr.on("data", (data) => {
        console.log("std ERR");
        console.error(data.toString());
      });
      //res.send(stdout);

      spawn_cp.on("close", (code) => {
        console.log("OK.. code: " + code);
        var preText = `Child exited with code ${code} : `;
        switch (code) {
          case 1:
            console.info(
              preText +
                "El comando BATCH se ejecuto correctamente, Accion Ver PDF..."
            );

            res.render("paginas/ctm-iframeViewPDF", {
              user: req.session.user,
              file_pdf: lista_soportes[0].nombre_soporte,
            });

            break;
          case 2:
            console.info(preText + "The file already exists");
            break;
          case 3:
            console.info(
              preText + "The file doesn't exists and now is created"
            );
            break;
          case 4:
            console.info(preText + "An error ocurred while creating the file");
            break;
        }
      });
    });
});

///form-ctm-calificacion-reg-indicador
router.post(
  "/form-ctm-calificacion-reg-indicador",
  authMiddleware,
  (req, res) => {
    modelControlMando
      .consultar_det_reg_ind_xcalificar(req.query.id_reg_indicador)
      .then((lista_reg_indicadores) => {
        //console.log(lista_Estrategias);lista_Estrategias
        //console.log(lista_reg_indicadores);
        res.setHeader("Content-type", "text/html");
        res.render("paginas/detalleCalificacion_reg_indicador", {
          lista_calificacion_indicadores: lista_reg_indicadores,
        });
      });
  }
);

router.post("/ctm-respuesta-reg-indicador", authMiddleware, (req, res) => {
  //res.send('OK');

  //consultar_RegistrosPlan_General_x_id
  console.log("id_reg_in:" + req.query.id_registroindicador);

  modelControlMando
    .consultar_det_respuesta_indicador(req.query.id_registroindicador)
    .then((lista_detalle_indicador) => {
      res.render("paginas/ctm_respuesta_indicadores.ejs", {
        id_registroindicador: req.query.id_registroindicador,
        lista_detalle_indicador: lista_detalle_indicador,
      });
      //res.render("paginas/ctm_objetivos", { user: req.session.user, listaPlanes_grales: listaPlanes_grales });
    });
});

//form-ctm-visualizar-reg-indicador/

router.post(
  "/form-ctm-visualizar-reg-indicador",
  authMiddleware,
  (req, res) => {
    modelControlMando
      .consultar_det_reg_ind_evaluacion(req.query.id_reg_indicador)
      .then((lista_reg_indicadores) => {
        //console.log(lista_Estrategias);lista_Estrategias
        console.log(lista_reg_indicadores);
        res.setHeader("Content-type", "text/html");
        res.render("paginas/detalleVisualizacion_reg_indicador", {
          lista_calificacion_indicadores: lista_reg_indicadores,
        });
      });
  }
);

//consultar-calificacion-reg-indicador
router.post(
  "/consultar-calificacion-reg-indicador",
  authMiddleware,
  (req, res) => {
    modelControlMando
      .consultar_det_cal_x_regIndicador(req.query.id_reg_indicador)
      .then((calificacion) => {
        //console.log(lista_Estrategias);lista_Estrategias
        console.log(calificacion);
        //res.setHeader('Content-type', 'text/html');
        res.send(calificacion);
      });
  }
);

router.get(
  "/obtener_trazabilidad_x_indicador_profesional_vigencia_periodo",
  authMiddleware,
  (req, res) => {
    //select a.id_registroindicador, a.vigencia, e.nombre_mes, b.id_indicador, b.nombre_indicador, u.num_identificacion, concat(u.nombre, ' ', u.apellido) as nombre_profesional from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (u.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) where a.vigencia = $1 and e.id_mes = $2 and d.id_area = $3 order by a.id_registroindicador
    console.log(req.query);
    modelControlMando
      .consultar_trazabilidad_reg_indicador(
        Number(req.query.id_indicador),
        Number(req.query.profesional),
        req.query.vigencia,
        Number(req.query.periodo)
      )
      .then((lista_trazabilidad) => {
        console.log(lista_trazabilidad);
        //res.send(lista_trazabilidad);
        res.render("paginas/lista_ctm_trazabilidad", {
          lista_trazabilidad: lista_trazabilidad,
        });
      });
  }
);


router.post("/persistir-estrategia/", authMiddleware, (req, res) => {
  modelControlMando
    .insertar_estrategia(req.query.estrategia, req.query.objetivo)
    .then((respuesta) => {
      if (respuesta["command"] == "INSERT" && respuesta["rowCount"] > 0) {
        console.log("OK... insert NEW");
        res.json({
          status: 200,
          msg:
            "La estrategia <b>" +
            req.query.estrategia +
            "</b>, se creó correctamente...",
        });
      } else {
        //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' intente de nuevo...');
        res.json({
          status: 300,
          msg:
            "ERROR al crear la estrategia <b>" +
            req.query.estrategia +
            "</b>, intente de nuevo...",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      //req.flash('error', 'ERROR al crear la entidad ' + req.query.nombre_entidad + ', con codigo ' + req.query.cod_entidad + ' Ya existe...');
      res.json({
        status: 500,
        msg:
          "ERROR!! la estrategia <b>" +
          req.query.estrategia +
          " </b> YA EXISTE...",
      });
    });
});

router.post("/persistir-area/", authMiddleware, (req, res) => {
  modelControlMando
    .insertar_area(req.query.nombre_area)
    .then((respuesta) => {
      if (respuesta["command"] == "INSERT" && respuesta["rowCount"] > 0) {
        console.log("OK... insert NEW");
        res.json({
          status: 200,
          msg:
            " el area <b>" +
            req.query.nombre_area +
            "</b>, se creó correctamente...",
        });
      } else {
        //req.flash('error', 'ERROR al crear el area ' + req.query.nombre_area + ', con codigo ' + req.query.id_area + ' intente de nuevo...');
        res.json({
          status: 300,
          msg:
            "ERROR al crear  el area <b>" +
            req.query.nombre_area +
            "</b>, intente de nuevo...",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      //req.flash('error', 'ERROR al crear el area ' + req.query.nombre_area + ', con codigo ' + req.query.id_area + ' Ya existe...');
      res.json({
        status: 500,
        msg:
          "ERROR!!  el area <b>" + req.query.nombre_area + " </b> YA EXISTE...",
      });
    });
});

router.post("/persistir-plan-accion/", authMiddleware, (req, res) => {
  modelControlMando
    .insertar_plan(req.query.plan, req.query.estrategia)
    .then((respuesta) => {
      if (respuesta["command"] == "INSERT" && respuesta["rowCount"] > 0) {
        console.log("OK... insert NEW");
        res.json({
          status: 200,
          msg:
            " el plan <b>" + req.query.plan + "</b>, se creó correctamente...",
        });
      } else {
        //req.flash('error', 'ERROR al crear el plan ' + req.query.plan + ', con codigo ' + req.query.cod_entidad + ' intente de nuevo...');
        res.json({
          status: 300,
          msg:
            "ERROR al crear  el plan <b>" +
            req.query.plan +
            "</b>, intente de nuevo...",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      //req.flash('error', 'ERROR al crear el plan ' + req.query.plan + ', con codigo ' + req.query.cod_entidad + ' Ya existe...');
      res.json({
        status: 500,
        msg: "ERROR!!  el plan <b>" + req.query.plan + " </b> YA EXISTE...",
      });
    });
});



router.get("/calcular-resultado-numerico", authMiddleware, (req, res) => {
  var valor_resultado_numerico = (
    (req.query.numerador / req.query.denominador) *
    100
  ).toFixed(2);
  res.send(valor_resultado_numerico.toString());
});

router.get("/calcular-desviacion", authMiddleware, (req, res) => {
  console.log("A:" + req.query.resultado_numerico);
  console.log("B:" + req.query.meta_numerica);

  var valor_desviacion = (
    req.query.meta_numerica / req.query.periodo_evaluacion -
    req.query.resultado_numerico
  ).toFixed(2);
  console.log("desviacion:" + valor_desviacion);
  res.send(valor_desviacion.toString());
});

///resultados-financieros
router.get("/resultados-financieros", authMiddleware, (req, res) => {
  res.render(
    path.join(__dirname + "/src/vista/paginas/rpt_financiero_contabilidad"),
    { user: req.session.user, area: req.session.username["nombre_area"] }
  );
});

router.get("/verPDF", authMiddleware, (req, res) => {
  res.render("paginas/ctm-iframeViewPDF", { user: req.session.user });
});



router.get("/estadistica-financiera", authMiddleware, (req, res) => {
  //console.log(lista_planes);
  res.render(
    path.join(__dirname + "/src/vista/paginas/rpt_financiero_contabilidad"),
    { user: req.session.user, area: req.session.username["nombre_area"] }
  );
});

module.exports = router;
