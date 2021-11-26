const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");
const modelControlMando = require("../models/controlMandoModel");

router.get("/obtener_soportesxreg_indicador/:id", authMiddleware, (req, res) => {
    //select a.id_registroindicador, a.vigencia, e.nombre_mes, b.id_indicador, b.nombre_indicador, u.num_identificacion, concat(u.nombre, ' ', u.apellido) as nombre_profesional from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (u.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) where a.vigencia = $1 and e.id_mes = $2 and d.id_area = $3 order by a.id_registroindicador
    console.log(req.query)
    modelControlMando.consultar_soportes_x_regIndicador(req.params.id).then(lista_soportes => {
        console.log(lista_soportes);

        res.render(config.rutaPartials +"soporte/list", {layout:false, lista_soportes: lista_soportes });
    });


});

module.exports = router;