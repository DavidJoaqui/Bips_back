const { query } = require("./persistencia/conexion");
const conexion = require("./persistencia/conexion");


module.exports = {

    //-----------------------Metodos Plan General-----------------------------------//
    //------------------------------------------------------------------------------//

    async insertar_PlanGeneral(plan_general, fecha_inicial, fecha_fin, es_activo) {
        const resultados = await conexion.query('insert into schema_control.plangeneral (plan_general,fecha_inicial, fecha_final, estado) values ($1,$2,$3,$4)', [plan_general, fecha_inicial, fecha_fin, es_activo]);
        return resultados;
    },

    async consultar_RegistrosPlan_General() {
        const resultados = await conexion.query("select p.id_plangeneral,p.plan_general, concat(to_char(p.fecha_inicial, 'MM'),'-',to_char(p.fecha_inicial, 'DD'),'-',to_char(p.fecha_inicial, 'YYYY')) as fecha_inicial ,concat(to_char(p.fecha_final , 'MM'),'-',to_char(p.fecha_final , 'DD'),'-',to_char(p.fecha_final , 'YYYY')) as fecha_final, p.estado from schema_control.plangeneral p");
        return resultados.rows;
    },

    async consultar_RegistrosPlan_General_x_id(id_plan) {
        const resultados = await conexion.query("select p.id_plangeneral,p.plan_general,concat(to_char(p.fecha_inicial, 'YYYY'),'-',to_char(p.fecha_inicial, 'MM'),'-',to_char(p.fecha_inicial, 'DD')) as fecha_inicial ,concat(to_char(p.fecha_final , 'YYYY'),'-',to_char(p.fecha_final , 'MM'),'-',to_char(p.fecha_final , 'DD')) as fecha_final, p.estado from schema_control.plangeneral p where id_plangeneral=$1", [id_plan]);
        return resultados.rows;
    },

    async actualizar_RegistrosPlan_General_x_id(id_plan, nombre_plan, fecha_inicial, fecha_fin, es_activo) {
        const resultados = await conexion.query("UPDATE schema_control.plangeneral set plan_general=$2, fecha_inicial=$3, fecha_final=$4, estado=$5 where id_plangeneral=$1", [id_plan, nombre_plan, fecha_inicial, fecha_fin, es_activo]);
        return resultados;
    },



    async eliminar_RegistroPlan_General(id) {
        const resultados = await conexion.query("delete from schema_control.plangeneral where id_plangeneral= $1", [id]);
        return resultados;
    },

    async eliminar_all_RegistrosPlan_generales() {
        const resultados = await conexion.query("delete from schema_planos.registros_planos_tmp where id_ips is not null");
        return resultados;
    },

    async obtener_mayor_id_planGeneral() {
        const resultados = await conexion.query("select MAX(id_plangeneral) max from schema_control.plangeneral;");
        return resultados.rows;
    },



    //-----------------------Metodos LINEAS DE ACCION--------------------------------//
    //------------------------------------------------------------------------------//
    //consultar_RegistrosLineasAccion

    async consultar_RegistrosLineasAccion() {
        const resultados = await conexion.query("select pg.plan_general,la.linea_accion, la.id_linea from schema_control.lineas_acciones la inner join schema_control.plangeneral pg on(la.id_plan_general=id_plangeneral) order by la.id_linea ASC");
        return resultados.rows;
    },
    async consultar_LineasAccionXplangral(id_plan_general) {
        const resultados = await conexion.query("select id_linea, linea_accion from schema_control.lineas_acciones where id_plan_general = $1", [id_plan_general]);
        return resultados.rows;
    },

    async consultar_LineasAccionXId(id_linea) {
        const resultados = await conexion.query("select id_linea,p.id_plangeneral,p.plan_general,p.estado ,linea_accion from schema_control.lineas_acciones la inner join schema_control.plangeneral p on(la.id_plan_general=p.id_plangeneral) where id_linea = $1", [id_linea]);
        return resultados.rows;
    },
    async obtener_mayor_id_lineaAccion() {
        const resultados = await conexion.query("select MAX(id_linea) max from schema_control.lineas_acciones;");
        return resultados.rows;
    },

    async insertar_lineaAccion(linea_accion, id_plangeneral) {
        const resultados = await conexion.query('insert into schema_control.lineas_acciones (linea_accion,id_plan_general) values ($1,$2)', [linea_accion, id_plangeneral]);
        return resultados;
    },

    //actualizar_RegistroLineaAccion_x_id
    async actualizar_RegistroLineaAccion_x_id(id_linea_accion, linea_accion, id_plangeneral) {
        const resultados = await conexion.query('update schema_control.lineas_acciones set id_plan_general=$3, linea_accion=$2 where id_linea=$1 ', [id_linea_accion, linea_accion, id_plangeneral]);
        return resultados;
    },

    async eliminar_RegistroLineaAccion(id) {
        const resultados = await conexion.query("delete from schema_control.lineas_acciones where id_linea= $1", [id]);
        return resultados;
    },



    //-----------------------Metodos OBJETIVOS--------------------------------------//
    //------------------------------------------------------------------------------//
    //consultar_RegistrosObjetivos

    async consultar_ObjetivosXlinea(id_linea_accion) {
        const resultados = await conexion.query("select * from schema_control.objetivos where id_linea_accion = $1", [id_linea_accion]);
        return resultados.rows;
    },

    async consultar_RegistrosObjetivos() {
        const resultados = await conexion.query("select obj.id_linea_accion ,obj.id_objetivo, obj.objetivo, t2.linea_accion as desc_linea_accion from schema_control.objetivos obj inner join(select t1.id_linea,concat(t1.linea_accion,' (',t1.plan_general,')') as linea_accion from (select pg.plan_general,la.linea_accion, la.id_linea from schema_control.lineas_acciones la inner join schema_control.plangeneral pg on(la.id_plan_general=id_plangeneral) order by la.id_linea asc)t1)t2  on(obj.id_linea_accion=t2.id_linea)");
        return resultados.rows;
    },


    async consultar_RegistrosObjetivos__LineasAccion(id_plan_general) {
        const resultados = await conexion.query("select t1.id_linea,concat(t1.linea_accion,' (',t1.plan_general,')') as linea_accion from (select pg.plan_general,la.linea_accion, la.id_linea from schema_control.lineas_acciones la inner join schema_control.plangeneral pg on(la.id_plan_general=id_plangeneral) order by la.id_linea asc)t1");
        return resultados.rows;
    },

    //obtener_mayor_id_Objetivos
    async obtener_mayor_id_Objetivos() {
        const resultados = await conexion.query("select MAX(id_objetivo) max from schema_control.objetivos;");
        return resultados.rows;
    },

    async insertar_Objetivo(objetivo, id_linea_accion) {
        const resultados = await conexion.query('insert into schema_control.objetivos (objetivo,id_linea_accion) values ($1,$2)', [objetivo, id_linea_accion]);
        return resultados;
    },

    async consultar_RegistroObjetivos_x_id(id_obj) {
        const resultados = await conexion.query("select obj.id_objetivo,obj.objetivo,obj.id_linea_accion,la.id_plan_general from schema_control.objetivos obj inner join schema_control.lineas_acciones la on(obj.id_linea_accion=la.id_linea) where obj.id_objetivo = $1", [id_obj]);
        return resultados.rows;
    },

    async actualizar_RegistroObjetivo_x_id(id_obj, id_linea_accion, objetivo) {
        const resultados = await conexion.query('update schema_control.objetivos set objetivo=$3, id_linea_accion=$2 where id_objetivo=$1 ', [id_obj, id_linea_accion, objetivo]);
        return resultados;
    },



    //-----------------------Metodos ESTRATEGIAS--------------------------------------//
    //------------------------------------------------------------------------------//

    async consultar_RegistrosObjetivosxlineas() {
        const resultados = await conexion.query("select * from schema_control.objetivos a inner join schema_control.lineas_acciones b on (a.id_linea_accion=b.id_linea)");
        return resultados.rows;
    },

    async insertar_estrategia(estrategia, id_objetivo) {
        const resultados = await conexion.query('insert into schema_control.estrategias (estrategia,id_objetivo) values ($1,$2)', [estrategia, id_objetivo]);
        return resultados;
    },

    async consultar_RegistrosEstrategias() {
        const resultados = await conexion.query("select a.id_estrategia,a.estrategia, b.id_objetivo, b.objetivo from schema_control.estrategias a inner join schema_control.objetivos b on (a.id_objetivo=b.id_objetivo)");
        return resultados.rows;
    },

    async consultar_EstartegiasXobetivo(id_objetivo) {
        const resultados = await conexion.query("select * from schema_control.estrategias where id_objetivo = $1", [id_objetivo]);
        return resultados.rows;
    },



    //---------------------------Metodos PLanes--------------------------------------//
    //------------------------------------------------------------------------------//


    async insertar_plan(plan, id_estrategia) {
        const resultados = await conexion.query('insert into schema_control.planes (plan,id_estrategia) values ($1,$2)', [plan, id_estrategia]);
        return resultados;
    },

    async consultar_RegistroPlanes() {
        const resultados = await conexion.query("select * from schema_control.planes");
        return resultados.rows;
    },

    async consultar_PlanesXestrategia(id_estrategia) {
        const resultados = await conexion.query("select * from schema_control.planes where id_estrategia = $1", [id_estrategia]);
        return resultados.rows;
    },

    //-----------------------Metodos Areas--------------------------------------//
    //------------------------------------------------------------------------------//
    async insertar_area(nombre_area) {
        const resultados = await conexion.query('insert into schema_control.areas (nombre_area) values ($1)', [nombre_area]);
        return resultados;
    },

    async consultar_RegistroAreas() {
        const resultados = await conexion.query("select * from schema_control.areas");
        return resultados.rows;
    },

    //-----------------------Metodos Indicadores--------------------------------------//
    //------------------------------------------------------------------------------//
    async insertar_indicador(nombre_indicador, id_plan, id_area, tipo_meta, formula_literal_descriptiva, meta_descriptiva, meta_numerica, formula_literal_numerador, formula_literal_denominador) {
        const resultados = await conexion.query('insert into schema_control.indicadores (nombre_indicador,id_plan,id_area,tipo_meta,formula_literal_descriptiva,meta_descriptiva,meta_numerica,formula_literal_numerador,formula_literal_denominador) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)', [nombre_indicador, id_plan, id_area, tipo_meta, formula_literal_descriptiva, meta_descriptiva, meta_numerica, formula_literal_numerador, formula_literal_denominador]);
        return resultados;
    },

    async consultar_RegistrosIndicadores() {
        const resultados = await conexion.query("select ind.tipo_meta,ind.formula_literal_numerador,ind.formula_literal_denominador, ind.meta_descriptiva, ind.formula_literal_descriptiva, ind.nombre_indicador,ind.meta_numerica,a.nombre_area, pa.plan, e.estrategia,o.objetivo,la.linea_accion, pg.plan_general from schema_control.indicadores ind  inner join schema_control.areas a on(ind.id_area=a.id_area) inner join schema_control.planes pa on(ind.id_plan=pa.id_plan) inner join schema_control.estrategias e on(pa.id_estrategia=e.id_estrategia) inner join schema_control.objetivos o on(e.id_objetivo=o.id_objetivo) inner join schema_control.lineas_acciones la on(o.id_linea_accion=la.id_linea) inner join schema_control.plangeneral pg on(la.id_plan_general=pg.id_plangeneral)");
        return resultados.rows;
    },


    //-----------------------Metodos Registro Indicadores--------------------------------------//
    //------------------------------------------------------------------------------//

    async consultar_reg_indicadores() {
        const resultados = await conexion.query("select a.id_registroindicador,to_char(a.fecharegistro, 'DD/MM/YYYY') as fecharegistro, a.vigencia, e.nombre_mes,b.nombre_indicador,b.tipo_meta , a.formula_cifras_numerador,a.formula_cifras_denominador, a.soportes, a.observaciones,d.nombre_area ,concat(c.nombres, ' ', c.apellidos, ' ', c.num_identificacion) as nombre_profesional from schema_control.registroindicadores a inner join schema_control.indicadores b on(a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on(a.id_profesional = c.id_profesional) inner join schema_control.areas d on(b.id_area = d.id_area) inner join schema_control.periodo_mes e on(a.periodoevaluado = e.id_mes) order by a.id_registroindicador");        
        return resultados.rows;
    },

    async insertar_registro_indicador(indicador, profesional, vigencia, periodo, vr_numerador, vr_denominador, observacion) {
        const resultados = await conexion.query('INSERT INTO schema_control.registroindicadores (id_indicador, fecharegistro, id_profesional, vigencia, periodoevaluado, formula_cifras_numerador, formula_cifras_denominador, soportes, observaciones) values ($1,current_date,$2,$3,$4,$5,$6,null,$7)', [indicador, profesional, vigencia, periodo, vr_numerador, vr_denominador, observacion]);
        return resultados;
    },

    async consultar_vigencia_año() {
        const resultados = await conexion.query("select año from (select to_char(fecha_inicial, 'YYYY') as año from schema_control.plangeneral where estado = true group by año union all select to_char(fecha_final, 'YYYY') as año from schema_control.plangeneral where estado = true group by año) t group by año order by año");
        return resultados.rows;
    },

    async consultar_vigenciaxreg_indicadores() {
        const resultados = await conexion.query("select vigencia as año from schema_control.registroindicadores group by vigencia");
        return resultados.rows;
    },

    async consultar_periodoxaño(año) {
        const resultados = await conexion.query("select b.id_mes,b.nombre_mes  from schema_control.fecha a  inner join schema_control.periodo_mes b on (to_char(fecha, 'MM')=b.cod_mes) where to_char(fecha, 'YYYY') = $1 group by b.id_mes, b.nombre_mes order by b.id_mes asc", [año]);
        return resultados.rows;
    },

 


    async consultar_indicadorxarea(area) {
        const resultados = await conexion.query("select a.id_indicador, a.nombre_indicador from schema_control.indicadores a inner join schema_control.areas b on (a.id_area=b.id_area) where b.id_area =$1", [area]);
        return resultados.rows;
    },

    async consultar_indicadorxperiodo_area(vigencia,periodo,area) {
        const resultados = await conexion.query("select b.id_indicador,b.nombre_indicador from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador=b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional=c.id_profesional) inner join schema_control.areas d on (b.id_area=d.id_area) inner join schema_control.periodo_mes e on(a.periodoevaluado=e.id_mes) where a.vigencia =$1 and e.id_mes = $2 and d.id_area =$3 order by a.id_registroindicador", [vigencia,periodo,area]);
        return resultados.rows;
    },

    async consultar_det_indicador(vigencia,periodo,area,indicador) {
        const resultados = await conexion.query("select a.id_registroindicador,to_char(a.fecharegistro, 'DD/MM/YYYY') as fecharegistro, a.vigencia, e.nombre_mes,b.id_indicador, b.nombre_indicador, b.tipo_meta , b.formula_literal_numerador, b.formula_literal_denominador,b.formula_literal_descriptiva,b.meta_descriptiva,b.meta_numerica, a.formula_cifras_numerador,a.formula_cifras_denominador, a.soportes, a.observaciones, d.nombre_area ,concat(c.nombres,' ',c.apellidos,' ',c.num_identificacion) as nombre_profesional from schema_control.registroindicadores a  inner join schema_control.indicadores b on (a.id_indicador=b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional=c.id_profesional) inner join schema_control.areas d on (b.id_area=d.id_area) inner join schema_control.periodo_mes e on(a.periodoevaluado=e.id_mes) where a.vigencia =$1 and e.id_mes = $2 and d.id_area =$3 and b.id_indicador =$4 order by a.id_registroindicador", [vigencia,periodo,area,indicador]);
        return resultados.rows;
    },




    //-----------------------Metodos PROFESIONALES--------------------------------------//
    //------------------------------------------------------------------------------//
    //consultar_RegistrosProfesionales
    async consultar_RegistrosProfesionales() {
        const resultados = await conexion.query("select p.num_identificacion,p.nombres, p.apellidos, a.nombre_area from schema_control.profesionales p inner join schema_control.areas a on(p.id_area_trabajo=a.id_area) order by p.id_profesional ASC");
        return resultados.rows;
    },
    async consultar_profesionalxarea(area) {
        const resultados = await conexion.query("select id_profesional,id_area, concat(a.nombres,' ',a.apellidos,' ',a.num_identificacion) as nombre_profesional from schema_control.profesionales a inner join schema_control.areas b on (a.id_area_trabajo=b.id_area) where b.id_area =$1", [area]);
        return resultados.rows;
    },

    //consultar_RegistroAreas

    async consultar_RegistroAreas() {
        const resultados = await conexion.query("select id_area, nombre_area from schema_control.areas");
        return resultados.rows;
    },

    //insertar_Profesional
    async insertar_Profesional(num_id_prof, nombres, apellidos, id_area) {
        const resultados = await conexion.query('insert into schema_control.profesionales (num_identificacion,nombres,apellidos,id_area_trabajo) values ($1,$2,$3,$4)', [num_id_prof, nombres, apellidos, id_area]);
        return resultados;
    },

        //-----------------------Metodos calificacion indicadores--------------------------------------//
    //------------------------------------------------------------------------------//

    async consultar_periodoxaño_calificacion(año) {
        const resultados = await conexion.query("select b.id_mes ,b.nombre_mes from schema_control.registroindicadores a inner join schema_control.periodo_mes b on (a.periodoevaluado=b.id_mes) where a.vigencia = $1 group by b.id_mes, b.nombre_mes order by b.id_mes", [año]);
        return resultados.rows;
    },

    async consultar_areaxperiodo_calificacion(periodo,vigencia) {
        const resultados = await conexion.query("select c.id_area, c.nombre_area from schema_control.registroindicadores a inner join schema_control.profesionales b on (a.id_profesional=b.id_profesional) inner join schema_control.areas c on(b.id_area_trabajo=c.id_area) where a.periodoevaluado = $1 and a.vigencia =$2 group by c.id_area, c.nombre_area order by c.nombre_area asc", [periodo,vigencia]);
        return resultados.rows;
    },



}