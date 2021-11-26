const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");
const modelControlMando = require("../models/controlMandoModel");

router.get("/ctm-calificacion-indicadores", authMiddleware, (req, res) => {
  modelControlMando
    .consultar_reg_ind_xcalificar()
    .then((lista_calificacion_indicadores) => {
      res.render(config.rutaPartials + "calificacionIndicador/registro_indicador_x_calificar", {
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

module.exports = router;
