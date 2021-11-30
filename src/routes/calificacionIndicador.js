const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");
const modelControlMando = require("../models/controlMandoModel");

router.get("/ctm-calificacion-indicadores", authMiddleware, (req, res) => {
  modelControlMando
    .consultar_reg_ind_xcalificar()
    .then((lista_calificacion_indicadores) => {
      res.render(config.rutaPartials + "calificacionIndicador/list", {
        layout:false,
        lista_calificacion_indicadores: lista_calificacion_indicadores,
      });
    });
});

router.get("/form-ctm-calificacion-reg-indicador/:id", authMiddleware, (req, res) => {

  modelControlMando.consultar_det_reg_ind_xcalificar(req.params.id).then(lista_reg_indicadores => {
      //console.log(lista_Estrategias);lista_Estrategias
      //console.log(lista_reg_indicadores);
      //res.setHeader('Content-type', 'text/html');
      res.render(config.rutaPartials +"calificacionIndicador/detalle", {layout:false, lista_calificacion_indicadores: lista_reg_indicadores });
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


  modelControlMando.insertar_calificacion_indicador(Number(req.query.reg_indicador), parseFloat(req.query.vr_numerador), parseFloat(req.query.vr_denominador), parseFloat(req.query.resultado_numerico), Number(req.query.resultado_descriptivo), parseFloat(req.query.desviacion), req.query.comentario, Number(req.query.estado)).then(respuesta => {


      if (respuesta['command'] == "INSERT" && respuesta['rowCount'] > 0) {

          //actualizarRegIndicador
          modelControlMando.actualizar_RegIndicador_calificado(req.query.reg_indicador).then(calificado => {

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

module.exports = router;
