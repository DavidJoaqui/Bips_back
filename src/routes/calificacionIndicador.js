const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");
const modelControlMando = require("../models/controlMandoModel");

router.get("/ctm-calificacion-indicadores", authMiddleware, (req, res) => {
  modelControlMando
    .consultar_reg_ind_xcalificar()
    .then((lista_calificacion_indicadores) => {

      modelControlMando.consultar_vigenciaxreg_indicadores().then(lista_años => {
        res.render(config.rutaPartials + "calificacionIndicador/list", {
          layout: false,
          lista_calificacion_indicadores: lista_calificacion_indicadores,
          lista_años: lista_años,
        });

      });
    });
});

router.get("/calificaciones", authMiddleware, (req, res) => {
  modelControlMando
    .consultar_reg_ind_xcalificar()
    .then((lista_calificacion_indicadores) => {

      modelControlMando.consultar_vigenciaxreg_indicadores().then(lista_años => {
        res.render(config.rutaPartials + "calificacionIndicador/index", {
          user: req.session.username["nombre"],
          nombre_rol: req.session.username["nombre_rol"],
          rol: req.session.username["rol"],
          permisos: req.session.username["permisos"],
          area: req.session.username["nombre_area"],
          lista_calificacion_indicadores: lista_calificacion_indicadores,
          lista_años: lista_años,
        });

      });
    });
});

router.get("/ctm-lista-calificados", authMiddleware, (req, res) => {

  modelControlMando.consultar_registros_Calificados().then(lista_calificacion_indicadores => {
    //console.log(lista_Estrategias);lista_Estrategias
    res.render(config.rutaPartials + "calificacionIndicador/listcalificados", {
      layout: false,
      lista_calificacion_indicadores: lista_calificacion_indicadores,
    });
  });


});

router.get("/ctm-lista-semaforizacion", authMiddleware, (req, res) => {
  modelControlMando.consultar_registros_Semaforizacion().then(lista_semaforizacion => {
    //console.log(lista_Estrategias);lista_Estrategias
    res.render(config.rutaPartials + "calificacionIndicador/listsemaforizacion", {
      layout: false,
      lista_semaforizacion: lista_semaforizacion,
    });
  });
});

router.get("/ctm-lista-semaforizacion-planes/:campo", authMiddleware, (req, res) => {
 
//console.log(req.query.campo); 
console.log(req.params.campo); 
//console.log(req.body.campo); 
filtro_campo = req.params.campo;
filtro_txt = req.query.txt;

  if(filtro_campo == 'plan_general'){

    filtro_txt = 'Política';

  }
  else if(filtro_campo == 'linea_accion'){

    filtro_txt = 'PROGRAMA';

  }
  else if(filtro_campo == 'objetivo'){

    filtro_txt = 'Objetivo';

  }
  else if(filtro_campo == 'estrategia'){

    filtro_txt = 'Actividad';

  }
  else if(filtro_campo == 'plan'){

    filtro_txt = 'Evidencia';

  }
  

  modelControlMando.consultar_registros_semaforizacion_planes(req.params.campo).then(lista_semaforizacion => {
    
  console.log(lista_semaforizacion);
   
    
    res.render(config.rutaPartials + "calificacionIndicador/listsemaforizacionplanes", {
      layout: false,
      lista_semaforizacion: lista_semaforizacion,
      campo: filtro_txt
    });
  });
});

router.get("/ctm-lista-semaforizacion-plan-general", authMiddleware, (req, res) => {
  modelControlMando.consultar_registros_semaforizacion_plan_general().then(lista_semaforizacion => {
    //console.log(lista_Estrategias);lista_Estrategias
    res.render(config.rutaPartials + "calificacionIndicador/listsemaforizacionplangeneral", {
      layout: false,
      lista_semaforizacion: lista_semaforizacion,
    });
  });
});


router.get("/form-ctm-calificacion-reg-indicador/:id", authMiddleware, (req, res) => {
  modelControlMando.consultar_det_reg_ind_xcalificar(req.params.id).then(lista_reg_indicadores => {
    //console.log(lista_Estrategias);lista_Estrategias
    //console.log(lista_reg_indicadores);
    //res.setHeader('Content-type', 'text/html');
    res.render(config.rutaPartials + "calificacionIndicador/detalle", { layout: false, lista_calificacion_indicadores: lista_reg_indicadores });
  });
});

router.get("/edit-ctm-calificacion-reg-indicador/:id", authMiddleware, (req, res) => {

  modelControlMando.consultar_calificacion_reg_indicador(req.params.id).then(lista_reg_indicadores => {

    res.render(
      config.rutaPartials + "calificacionIndicador/detalle",
      {
        layout: false,
        lista_calificacion_indicadores: lista_reg_indicadores,
      });
  });



});

router.get("/calcular-resultado-numerico", authMiddleware, (req, res) => {

  //console.log('A:'+req.query.numerador);
  //console.log('B:'+req.query.denominador);

  var valor_resultado_numerico = ((req.query.numerador / req.query.denominador) * 100).toFixed(2);
  // console.log('resultado_num:'+valor_resultado_numerico);
  res.send(valor_resultado_numerico.toString());

});

router.get("/calcular-desviacion", authMiddleware, (req, res) => {

  console.log('A:' + req.query.resultado_numerico);
  console.log('B:' + req.query.meta_numerica);

  var valor_desviacion = ((req.query.meta_numerica / req.query.periodo_evaluacion) - req.query.resultado_numerico).toFixed(2);
  console.log('desviacion:' + valor_desviacion);
  res.send(valor_desviacion.toString());

});

//persistir-calificacion-indicador
router.post("/persistir-calificacion-indicador", authMiddleware, (req, res) => {

  modelControlMando.insertar_calificacion_indicador(Number(req.body.id_reg_indicador), parseFloat(req.body.txt_vr_numerador), parseFloat(req.body.txt_vr_denominador), parseFloat(req.body.txt_resultado_numerico), Number(req.body.select_resultado_descriptivo), parseFloat(req.body.txt_desviacion), req.body.txt_comentario, Number(req.body.select_aprobar)).then(respuesta => {


    if (respuesta['command'] == "INSERT" && respuesta['rowCount'] > 0) {

      //actualizarRegIndicador
      modelControlMando.actualizar_RegIndicador_calificado(req.body.id_reg_indicador).then(calificado => {

        if (calificado['command'] == "UPDATE" && calificado['rowCount'] > 0) {
          console.log("OK... insert NEW Indicador, update registro de indicador --> calificado: 1");
          res.json({ status: 200, msg: 'La Calificación del Indicador se registro correctamente...' });
        } else {
          console.log("Ocurrio un Error al generar la calificacion el registro de Indicador");
          res.json({ status: 300, msg: 'Ocurrio un Error al generar la calificación del registro de Indicador' });
        }



      });


    } else {
      res.json({ status: 300, msg: 'ERROR al crear al calificar el Indicador, intente de nuevo...' });
    }
  }).catch(err => {
    console.log(err);
    res.json({ status: 500, msg: 'ERROR!! Ocurrio un problema al realizar la Calificación del Indicador, contacte con el administrador! ...' });
  });
})

router.get("/consultar-periodo-x-anio-calificacion", authMiddleware, (req, res) => {

  modelControlMando.consultar_periodoxaño_calificacion(req.query.año).then(lista_periodo => {
    res.send(lista_periodo);
  });
});

router.get("/consultar-area-x-periodo-calificacion", authMiddleware, (req, res) => {
  //console.log('periodo'+req.query.periodo);
  //console.log('vigencia'+req.query.vigencia);

  modelControlMando.consultar_areaxperiodo_calificacion(req.query.periodo, req.query.vigencia).then(lista_area => {
    //console.log('lista_area'+lista_area);
    res.send(lista_area);

  });

});

router.get("/obtener-reg-indicadores_xvigencia_xperiodo_xarea", authMiddleware, (req, res) => {
  //console.log('id_area:' + req.query.area);
  //console.log('VIGENCIA:' + req.query.vigencia);
  //console.log('PERIODO:' + req.query.periodo);


  modelControlMando.consultar_indicadorxVigencia_xPeriodo_xarea(req.query.vigencia, req.query.periodo, req.query.area).then(resultados_reg_indicadores => {
    res.send(resultados_reg_indicadores);

  });
});

router.get("/lista-ctm-reg-ind-xcal-filtrado", authMiddleware, (req, res) => {

  modelControlMando.consultar_reg_ind_xcal_filtrado(req.query.vigencia, req.query.periodo, req.query.area, req.query.indicador).then(lista_reg_indicadores => {

    res.render(config.rutaPartials + "calificacionIndicador/listtable", 
    { layout: false, lista_calificacion_indicadores: lista_reg_indicadores });

  });


});

router.put("/actualizar-calificacion", authMiddleware, (req, res) => {

  console.log(req.body);
  console.log(req.query);
  console.log(req.params);

  modelControlMando
    .actualizar_calificacion(
      req.body.id_calificacion_indicador,
      req.body.txt_comentario,
      req.body.select_aprobar,
      req.body.select_resultado_descriptivo
    )
    .then(respuesta => {
      if (respuesta["command"] == "UPDATE" && respuesta["rowCount"] > 0) {
        return res.status(200).send("Ok");
      } else {
        return res.status(400).send("Error al actualizar la calificación");
      }
    })
    .catch((err) => {
      return res.status(500).send("Error al actualizar los datos de calificación");
    });
});

router.delete(
  "/calificacion/delete/:id_cal/:id_reg_ind/control-mando-bips",
  authMiddleware,
  function (req, res) {
    modelControlMando
      .eliminar_RegistroCalificacion(req.params.id_cal)
      .then((respuesta) => {
        if (respuesta["command"] == "DELETE" && respuesta["rowCount"] > 0) {

          modelControlMando
            .actualizar_calificadoRegIndicador(req.params.id_reg_ind)
            .then(result_act => {

              if (result_act["command"] == "UPDATE" && result_act["rowCount"] > 0) {
                return res.status(200).send("Ok");
              } else {
                return res.status(400).send("Error al actualizar la calificación");
              }

            });

        } else {
          return res.status(400).send("Error al guardar datos");
        }
      }).catch((err) => {
        return res.status(500).send("Error al guardar datos");
      });
  }
);

module.exports = router;

