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

    async actualizar_plan_accion_x_id(id_plan, plan, id_estrategia) {
        const resultados = await conexion.query('update schema_control.planes set id_estrategia=$3, plan=$2 where id_plan=$1 ', [id_plan, plan, id_estrategia]);
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

    async consultar_plan_accion_x_id(id_plan) {
        const resultados = await conexion.query("select d.id_plan, d.plan,c.id_estrategia ,a.id_objetivo,a.id_linea_accion,b.id_plan_general from schema_control.objetivos a inner join schema_control.lineas_acciones b on(a.id_linea_accion=b.id_linea) inner join schema_control.estrategias c on (c.id_objetivo=a.id_objetivo) inner join schema_control.planes d on (d.id_estrategia=c.id_estrategia) where d.id_plan = $1", [id_plan]);
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

    async consultar_areaxid(id_area) {
        const resultados = await conexion.query('select * from schema_control.areas where id_area=$1 ', [id_area]);
        return resultados.rows;
    },

    async actualizar_area_x_id(id_area, area) {
        const resultados = await conexion.query('update schema_control.areas set nombre_area=$2 where id_area=$1 ', [id_area, area]);
        return resultados;
    },

    //-----------------------Metodos Indicadores--------------------------------------//
    //------------------------------------------------------------------------------//
    async insertar_indicador(nombre_indicador, id_plan, id_area, tipo_meta, formula_literal_descriptiva, meta_descriptiva, meta_numerica, formula_literal_numerador, formula_literal_denominador) {
        const resultados = await conexion.query('insert into schema_control.indicadores (nombre_indicador,id_plan,id_area,tipo_meta,formula_literal_descriptiva,meta_descriptiva,meta_numerica,formula_literal_numerador,formula_literal_denominador) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)', [nombre_indicador, id_plan, id_area, tipo_meta, formula_literal_descriptiva, meta_descriptiva, meta_numerica, formula_literal_numerador, formula_literal_denominador]);
        return resultados;
    },

    async actualizar_indicador(id_indicador, nombre_indicador, id_plan_accion, id_area, tipo_meta, formula_literal_descriptiva, meta_descriptiva, meta_numerica, formula_literal_numerador, formula_literal_denominador) {
        const resultados = await conexion.query('update schema_control.indicadores set nombre_indicador=$2, id_plan=$3, id_area=$4, tipo_meta=$5, formula_literal_descriptiva=$6, meta_descriptiva=$7, meta_numerica=$8,formula_literal_numerador=$9,formula_literal_denominador=$10 where id_indicador=$1 ', [id_indicador, nombre_indicador, id_plan_accion, id_area, tipo_meta, formula_literal_descriptiva, meta_descriptiva, meta_numerica, formula_literal_numerador, formula_literal_denominador]);
        return resultados;
    },

    async consultar_indicadores_x_id(id_indicador) {
        const resultados = await conexion.query("select f.id_indicador , f.nombre_indicador , f.tipo_meta, f.meta_numerica, f.meta_descriptiva,f.formula_literal_numerador, f.formula_literal_denominador, f.formula_literal_descriptiva , d.id_plan,c.id_estrategia ,a.id_objetivo, a.id_linea_accion,b.id_plan_general,g.id_area  from schema_control.objetivos a inner join schema_control.lineas_acciones b on(a.id_linea_accion=b.id_linea) inner join schema_control.estrategias c on (c.id_objetivo=a.id_objetivo) inner join schema_control.planes d on (d.id_estrategia=c.id_estrategia) inner join schema_control.plangeneral e on(e.id_plangeneral=b.id_plan_general) inner join schema_control.indicadores f on (f.id_plan =d.id_plan) inner join schema_control.areas g on (f.id_area=g.id_area) where f.id_indicador = $1", [id_indicador]);
        return resultados.rows;
    },

    async consultar_RegistrosIndicadores() {
        const resultados = await conexion.query("select ind.id_indicador,ind.tipo_meta,ind.formula_literal_numerador,ind.formula_literal_denominador, ind.meta_descriptiva, ind.formula_literal_descriptiva, ind.nombre_indicador,ind.meta_numerica,a.nombre_area, pa.plan, e.estrategia,o.objetivo,la.linea_accion, pg.plan_general from schema_control.indicadores ind  inner join schema_control.areas a on(ind.id_area=a.id_area) inner join schema_control.planes pa on(ind.id_plan=pa.id_plan) inner join schema_control.estrategias e on(pa.id_estrategia=e.id_estrategia) inner join schema_control.objetivos o on(e.id_objetivo=o.id_objetivo) inner join schema_control.lineas_acciones la on(o.id_linea_accion=la.id_linea) inner join schema_control.plangeneral pg on(la.id_plan_general=pg.id_plangeneral)");
        return resultados.rows;
    },

    async consultar_tipometaxidplan(id_plan) {
        const resultados = await conexion.query("select a.id_area,b.nombre_area , a.tipo_meta  from schema_control.indicadores a inner join schema_control.areas b on (a.id_area=b.id_area) where a.id_plan =$1 group by a.id_area,b.nombre_area, a.tipo_meta ", [id_plan]);
        return resultados.rows;
    },


    //-----------------------Metodos Registro Indicadores--------------------------------------//
    //------------------------------------------------------------------------------//

    async consultar_reg_indicadores() {
        const resultados = await conexion.query("select a.id_registroindicador, to_char(a.fecharegistro, 'DD/MM/YYYY') as fecharegistro, a.vigencia, e.nombre_mes, b.nombre_indicador, b.tipo_meta , a.formula_cifras_numerador, a.formula_cifras_denominador, a.observaciones, d.nombre_area , concat(u.nombre, ' ', u.apellido, ' ', u.num_identificacion) as nombre_profesional from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user=u.id_user) inner join schema_control.areas d on (b.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) order by a.id_registroindicador");
        return resultados.rows;
    },

    async consultar_reg_indicadores_x_profesional(idprof) {
        const resultados = await conexion.query("select a.id_registroindicador, to_char(a.fecharegistro, 'DD/MM/YYYY') as fecharegistro, a.vigencia, e.nombre_mes, b.nombre_indicador, b.tipo_meta , a.formula_cifras_numerador, a.formula_cifras_denominador, a.observaciones, d.nombre_area , concat(u.nombre, ' ', u.apellido, ' ', u.num_identificacion) as nombre_profesional from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (b.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) where c.id_profesional = $1 order by a.id_registroindicador", [idprof]);
        return resultados.rows;
    },


    async insertar_registro_indicador(indicador, profesional, vigencia, periodo, vr_numerador, vr_denominador, observacion) {
        const resultados = await conexion.query('INSERT INTO schema_control.registroindicadores (id_indicador, fecharegistro, id_profesional, vigencia, periodoevaluado, formula_cifras_numerador, formula_cifras_denominador, observaciones) values ($1,current_date,$2,$3,$4,$5,$6,$7) returning id_registroindicador', [indicador, profesional, vigencia, periodo, vr_numerador, vr_denominador, observacion]);
        return resultados;
    },

    async consultar_vigencia_año(profesional) {
        const resultados = await conexion.query("select to_char(f.fecha, 'YYYY') as periodo_año from schema_control.indicadores ind inner join schema_control.areas a on(ind.id_area = a.id_area) inner join schema_control.planes pa on(ind.id_plan = pa.id_plan) inner join schema_control.estrategias e on(pa.id_estrategia = e.id_estrategia) inner join schema_control.objetivos o on(e.id_objetivo = o.id_objetivo) inner join schema_control.lineas_acciones la on(o.id_linea_accion = la.id_linea) inner join schema_control.plangeneral pg on(la.id_plan_general = pg.id_plangeneral) inner join schema_control.fecha f on(pg.id_plangeneral = f.id_plan_general) inner join schema_control.profesionales p on(p.id_area_trabajo = a.id_area) where p.id_profesional = $1 and pg.estado = true group by periodo_año ", [profesional]);
        return resultados.rows;
    },

    async consultar_vigenciaxreg_indicadores() {
        const resultados = await conexion.query("select vigencia as año from schema_control.registroindicadores group by vigencia");
        return resultados.rows;
    },

    async consultar_periodoxaño(año) {
        const resultados = await conexion.query("select b.cod_mes,b.nombre_mes  from schema_control.fecha a  inner join schema_control.periodo_mes b on (to_char(fecha, 'MM')=b.cod_mes) where to_char(fecha, 'YYYY') = $1 group by b.id_mes, b.nombre_mes order by b.id_mes asc", [año]);
        return resultados.rows;
    },




    async consultar_indicadorxperiodo(area, vigencia, periodo) {
        const resultados = await conexion.query("select to_char(f.fecha, 'YYYY')as periodo_año,  to_char(f.fecha, 'MM')as periodo_mes ,ind.id_indicador, ind.nombre_indicador from schema_control.indicadores ind inner join schema_control.areas a on(ind.id_area=a.id_area) inner join schema_control.planes pa on(ind.id_plan=pa.id_plan) inner join schema_control.estrategias e on(pa.id_estrategia=e.id_estrategia) inner join schema_control.objetivos o on(e.id_objetivo=o.id_objetivo) inner join schema_control.lineas_acciones la on(o.id_linea_accion=la.id_linea) inner join schema_control.plangeneral pg on(la.id_plan_general=pg.id_plangeneral) inner join schema_control.fecha f on (pg.id_plangeneral=f.id_plan_general) where a.id_area =$1 and to_char(f.fecha, 'YYYY')=$2 and to_char(f.fecha, 'MM')= $3 and pg.estado = true group by periodo_mes, periodo_año, ind.id_indicador, ind.nombre_indicador", [area, vigencia, periodo]);
        return resultados.rows;
    },


    async validacion_insert_reg_indicadores(vigencia, periodo, area, indicador, profesional) {
        const resultados = await conexion.query("select a.id_registroindicador, a.vigencia, e.nombre_mes, b.id_indicador, b.nombre_indicador, concat(u.nombre, ' ', u.apellido, ' ', u.num_identificacion) as nombre_profesional from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (b.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) where a.vigencia = $1 and e.id_mes = $2 and d.id_area = $3 and b.id_indicador = $4 and a.id_profesional = $5 order by a.id_registroindicador ", [vigencia, periodo, area, indicador, profesional]);
        return resultados.rows;
    },


    async consultar_indicadorxperiodo_area(vigencia, periodo, area) {
        const resultados = await conexion.query("select b.id_indicador,b.nombre_indicador from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador=b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional=c.id_profesional) inner join schema_control.areas d on (b.id_area=d.id_area) inner join schema_control.periodo_mes e on(a.periodoevaluado=e.id_mes) where a.vigencia =$1 and e.id_mes = $2 and d.id_area =$3 order by a.id_registroindicador", [vigencia, periodo, area]);
        return resultados.rows;
    },

    async consultar_det_indicador(vigencia, periodo, area, indicador) {
        const resultados = await conexion.query("select to_char(f.fecha, 'YYYY') as periodo_año, to_char(f.fecha, 'MM') as periodo_mes, ind.id_indicador, ind.nombre_indicador, ind.tipo_meta, ind.formula_literal_numerador, ind.formula_literal_denominador, ind.formula_literal_descriptiva, ind.meta_descriptiva, ind.meta_numerica from schema_control.indicadores ind inner join schema_control.areas a on(ind.id_area = a.id_area) inner join schema_control.planes pa on(ind.id_plan = pa.id_plan) inner join schema_control.estrategias e on(pa.id_estrategia = e.id_estrategia) inner join schema_control.objetivos o on(e.id_objetivo = o.id_objetivo) inner join schema_control.lineas_acciones la on(o.id_linea_accion = la.id_linea) inner join schema_control.plangeneral pg on(la.id_plan_general = pg.id_plangeneral) inner join schema_control.fecha f on(pg.id_plangeneral = f.id_plan_general) where to_char(f.fecha, 'YYYY') = $1 and to_char(f.fecha, 'MM') = $2 and a.id_area = $3 and ind.id_indicador = $4 and pg.estado = true group by periodo_mes, periodo_año, ind.id_indicador, ind.nombre_indicador ", [vigencia, periodo, area, indicador]);
        return resultados.rows;
    },

    //-----------------------Metodos PROFESIONALES--------------------------------------//
    //------------------------------------------------------------------------------//
    //consultar_RegistrosProfesionales
    async consultar_RegistrosProfesionales() {
        const resultados = await conexion.query("select u.num_identificacion, u.nombre, u.apellido, a.nombre_area from schema_control.profesionales p inner join schema_seguridad.user u on (u.id_user = p.id_user) inner join schema_control.areas a on (u.id_area = a.id_area) where u.es_profesional = '1' order by p.id_profesional asc");
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

    async consultar_areaxperiodo_calificacion(periodo, vigencia) {
        const resultados = await conexion.query("select c.id_area, c.nombre_area from schema_control.registroindicadores a inner join schema_control.profesionales b on (a.id_profesional=b.id_profesional) inner join schema_control.areas c on(b.id_area_trabajo=c.id_area) where a.periodoevaluado = $1 and a.vigencia =$2 group by c.id_area, c.nombre_area order by c.nombre_area asc", [periodo, vigencia]);
        return resultados.rows;
    },

    async insertar_calificacion_indicador(reg_indicador, vr_numerador, vr_denominador, resultado_numerico, resultado_descriptivo, desviacion, comentario, estado) {
        const resultados = await conexion.query('INSERT INTO schema_control.calificacion_registro_indicadores (id_registro_indicador, vr_numerador, vr_denominador, resultado_numerico, resultado_descriptivo, desviacion, comentario, estado, fecha_calificacion) values ($1, $2,$3,$4, $5, $6, $7, $8,current_date)', [reg_indicador, vr_numerador, vr_denominador, resultado_numerico, resultado_descriptivo, desviacion, comentario, estado]);
        return resultados;
    },

    async consultar_calificacion_indicadores() {
        const resultados = await conexion.query("select f.id_calificacion_indicador ,to_char(f.fecha_calificacion, 'DD/MM/YYYY') as fecha_calificacion, a.vigencia, e.nombre_mes,b.nombre_indicador,b.tipo_meta , f.comentario ,f.estado, d.nombre_area ,concat(c.nombres, ' ', c.apellidos, ' ', c.num_identificacion) as nombre_profesional from schema_control.registroindicadores a inner join schema_control.indicadores b on(a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on(a.id_profesional = c.id_profesional) inner join schema_control.areas d on(b.id_area = d.id_area) inner join schema_control.periodo_mes e on(a.periodoevaluado = e.id_mes)  inner join schema_control.calificacion_registro_indicadores f on (a.id_registroindicador=f.id_registro_indicador) order by f.id_calificacion_indicador");
        return resultados.rows;
    },



}