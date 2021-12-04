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
        const resultados = await conexion.query("select obj.id_linea_accion ,obj.id_objetivo, obj.objetivo, t2.linea_accion, t2.plan_general from schema_control.objetivos obj inner join(select t1.id_linea,t1.plan_general, t1.linea_accion  from (select pg.plan_general,la.linea_accion, la.id_linea from schema_control.lineas_acciones la inner join schema_control.plangeneral pg on(la.id_plan_general=id_plangeneral) order by la.id_linea asc)t1)t2  on(obj.id_linea_accion=t2.id_linea)");
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

    async eliminar_RegistroObjetivo(id) {
        const resultados = await conexion.query("delete from schema_control.objetivos where id_objetivo= $1", [id]);
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
        const resultados = await conexion.query("select a.id_estrategia,a.estrategia, b.id_objetivo, b.objetivo, la.linea_accion, pg.plan_general from schema_control.estrategias a inner join schema_control.objetivos b on (a.id_objetivo=b.id_objetivo) inner join schema_control.lineas_acciones la on (b.id_linea_accion=la.id_linea) inner join schema_control.plangeneral pg on (la.id_plan_general=pg.id_plangeneral) ");
        return resultados.rows;
    },

    async consultar_EstartegiasXobetivo(id_objetivo) {
        const resultados = await conexion.query("select * from schema_control.estrategias where id_objetivo = $1", [id_objetivo]);
        return resultados.rows;
    },

    async consultar_RegistroEstrategia_x_id(id_est) {
        const resultados = await conexion.query("select est.*,obj.id_objetivo, obj.objetivo,la.id_linea,la.linea_accion,pg.id_plangeneral,pg.plan_general from schema_control.estrategias est inner join schema_control.objetivos obj on (est.id_objetivo=obj.id_objetivo) inner join schema_control.lineas_acciones la on (obj.id_linea_accion=la.id_linea) inner join schema_control.plangeneral pg on (la.id_plan_general=pg.id_plangeneral) where est.id_estrategia = $1", [id_est]);
        return resultados.rows;

    },

    async eliminar_RegistroEstrategia(id) {
        const resultados = await conexion.query("delete from schema_control.estrategias where id_estrategia= $1", [id]);
        return resultados;
    },


    async actualizar_RegistroEstrategia_x_id(id_est, id_objetivo, estrategia) {
        const resultados = await conexion.query('update schema_control.estrategias set estrategia=$3, id_objetivo=$2 where id_estrategia=$1 ', [id_est, id_objetivo, estrategia]);
        return resultados;
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
        const resultados = await conexion.query("select d.id_plan, d.plan,c.estrategia ,a.objetivo,b.linea_accion,pg.plan_general from schema_control.objetivos a inner join schema_control.lineas_acciones b on(a.id_linea_accion=b.id_linea) inner join schema_control.estrategias c on (c.id_objetivo=a.id_objetivo) inner join schema_control.planes d on (d.id_estrategia=c.id_estrategia) inner join  schema_control.plangeneral pg on (pg.id_plangeneral=b.id_plan_general)" );
        return resultados.rows;
    },

    //consultar_PlanesXestrategia
    async consultar_PlanesXestrategia(id_estrategia) {
        const resultados = await conexion.query("select * from schema_control.planes where id_estrategia = $1", [id_estrategia]);
        return resultados.rows;
    },

    async consultar_plan_accion_x_id(id_plan) {
        const resultados = await conexion.query("select d.id_plan, d.plan,c.id_estrategia ,a.id_objetivo,a.id_linea_accion,b.id_plan_general from schema_control.objetivos a inner join schema_control.lineas_acciones b on(a.id_linea_accion=b.id_linea) inner join schema_control.estrategias c on (c.id_objetivo=a.id_objetivo) inner join schema_control.planes d on (d.id_estrategia=c.id_estrategia) where d.id_plan = $1", [id_plan]);
        return resultados.rows;
    },

    async eliminar_plan_accion(id) {
        const resultados = await conexion.query("delete from schema_control.planes where id_plan = $1", [id]);
        return resultados;
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

    async consultar_roles() {
        const resultados = await conexion.query("select * from schema_seguridad.rol");
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

    async eliminar_area(id) {
        const resultados = await conexion.query("delete from schema_control.areas where id_area = $1", [id]);
        return resultados;
    },

    //-----------------------Metodos Indicadores--------------------------------------//
    //------------------------------------------------------------------------------//
    async insertar_indicador(nombre_indicador, id_plan, id_area, tipo_meta, formula_literal_descriptiva, meta_descriptiva, periodo_evaluacion,meta_numerica, formula_literal_numerador, formula_literal_denominador) {
        const resultados = await conexion.query('insert into schema_control.indicadores (nombre_indicador,id_plan,id_area,tipo_meta,formula_literal_descriptiva,meta_descriptiva,periodo_meta_num,meta_numerica,formula_literal_numerador,formula_literal_denominador) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [nombre_indicador, id_plan, id_area, tipo_meta, formula_literal_descriptiva, meta_descriptiva, periodo_evaluacion,meta_numerica, formula_literal_numerador, formula_literal_denominador]);
        return resultados;
    },

    async actualizar_indicador(id_indicador, nombre_indicador, id_plan_accion, id_area, tipo_meta, formula_literal_descriptiva, meta_descriptiva, meta_numerica, formula_literal_numerador, formula_literal_denominador,periodo_evaluacion) {
        const resultados = await conexion.query('update schema_control.indicadores set nombre_indicador=$2, id_plan=$3, id_area=$4, tipo_meta=$5, formula_literal_descriptiva=$6, meta_descriptiva=$7, meta_numerica=$8,formula_literal_numerador=$9,formula_literal_denominador=$10,periodo_meta_num=$11  where id_indicador=$1 ', [id_indicador, nombre_indicador, id_plan_accion, id_area, tipo_meta, formula_literal_descriptiva, meta_descriptiva, meta_numerica, formula_literal_numerador, formula_literal_denominador,periodo_evaluacion]);
        return resultados;
    },

    async consultar_indicadores_x_id(id_indicador) {
        const resultados = await conexion.query("select f.id_indicador , f.nombre_indicador , f.tipo_meta,f.periodo_meta_num, f.meta_numerica, f.meta_descriptiva,f.formula_literal_numerador, f.formula_literal_denominador, f.formula_literal_descriptiva , d.id_plan,c.id_estrategia ,a.id_objetivo, a.id_linea_accion,b.id_plan_general,g.id_area  from schema_control.objetivos a inner join schema_control.lineas_acciones b on(a.id_linea_accion=b.id_linea) inner join schema_control.estrategias c on (c.id_objetivo=a.id_objetivo) inner join schema_control.planes d on (d.id_estrategia=c.id_estrategia) inner join schema_control.plangeneral e on(e.id_plangeneral=b.id_plan_general) inner join schema_control.indicadores f on (f.id_plan =d.id_plan) inner join schema_control.areas g on (f.id_area=g.id_area) where f.id_indicador = $1", [id_indicador]);
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

    async consultar_per_evaluacionxidindicador(id_indicador) {
        const resultados = await conexion.query("select periodo_meta_num from schema_control.indicadores where id_indicador = $1", [id_indicador]);
        return resultados.rows;
    },


    //-----------------------Metodos Registro Indicadores--------------------------------------//
    //------------------------------------------------------------------------------//

    async consultar_reg_indicadores() {
        const resultados = await conexion.query("select a.id_registroindicador, to_char(a.fecharegistro, 'DD/MM/YYYY') as fecharegistro, a.vigencia, e.nombre_mes, b.nombre_indicador, b.tipo_meta , a.formula_cifras_numerador, a.formula_cifras_denominador, a.observaciones, d.nombre_area , concat(u.nombre, ' ', u.apellido, ' ', u.num_identificacion) as nombre_profesional from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user=u.id_user) inner join schema_control.areas d on (b.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) order by a.id_registroindicador");
        return resultados.rows;
    },

    async consultar_reg_indicadores_x_id(id_indicador) {
        const resultados = await conexion.query("select CAST(r.vigencia AS varchar) periodo_año, p.cod_mes periodo_mes, r.*, i.tipo_meta,i.id_area from schema_control.registroindicadores r inner join schema_control.indicadores i on (r.id_indicador = i.id_indicador) inner join schema_control.periodo_mes p on (r.periodoevaluado=p.id_mes) where r.id_registroindicador = $1", [id_indicador]);
        return resultados.rows;
    },

    async consultar_reg_indicadores_x_profesional(idprof) {
        var version = '"version"';
        const resultados = await conexion.query("select c.id_profesional, a.version, a.id_indicador, a.periodoevaluado, a.id_registroindicador, to_char(a.fecharegistro, 'DD/MM/YYYY') as fecharegistro, a.vigencia, a.calificado, e.nombre_mes, e.id_mes , b.nombre_indicador, b.tipo_meta , a.formula_cifras_numerador, a.formula_cifras_denominador, a.observaciones, d.nombre_area , concat(u.nombre, ' ', u.apellido, ' ', u.num_identificacion) as nombre_profesional, (case when f.estado=true then 'Si' else 'No' end)::text as estado from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (b.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) left join schema_control.calificacion_registro_indicadores f on (a.id_registroindicador=f.id_registro_indicador) where c.id_profesional = $1 and a.id_registroindicador in ( select reg_ind.id_registroindicador from schema_control.registroindicadores reg_ind inner join ( select a2.id_indicador, a2.periodoevaluado, a2.vigencia, a2.id_profesional, max(a2.version) as "+version+" from schema_control.registroindicadores a2 inner join schema_control.indicadores b2 on (a2.id_indicador = b2.id_indicador) inner join schema_control.profesionales c2 on (a2.id_profesional = c2.id_profesional) inner join schema_seguridad.user u2 on (c2.id_user = u2.id_user) inner join schema_control.areas d2 on (b2.id_area = d2.id_area) inner join schema_control.periodo_mes e2 on (a2.periodoevaluado = e2.id_mes) where a2.id_profesional = $2 group by a2.id_indicador, a2.periodoevaluado, a2.vigencia, a2.id_profesional)t1 on (t1.id_indicador = reg_ind.id_indicador) and (t1.periodoevaluado = reg_ind.periodoevaluado) and (t1.vigencia = reg_ind.vigencia) and (t1.id_profesional = reg_ind.id_profesional) and (t1.version = reg_ind.version) ) order by a.vigencia, e.id_mes, a.id_registroindicador asc", [idprof, idprof]);
        return resultados.rows;
    },


    async insertar_registro_indicador(indicador, profesional, vigencia, periodo, vr_numerador, vr_denominador, observacion, calificado, version) {
        const resultados = await conexion.query('INSERT INTO schema_control.registroindicadores (id_indicador, fecharegistro, id_profesional, vigencia, periodoevaluado, formula_cifras_numerador, formula_cifras_denominador, observaciones,calificado, version) values ($1,current_timestamp,$2,$3,$4,$5,$6,$7,$8,$9) returning id_registroindicador', [indicador, profesional, vigencia, periodo, vr_numerador, vr_denominador, observacion, calificado, version]);
        return resultados;
    },
    async actualizar_reg_indicador(id_registroindicador,vr_numerador, vr_denominador, observacion) {
        const resultados = await conexion.query('update schema_control.registroindicadores set formula_cifras_numerador = $2, formula_cifras_denominador = $3, observaciones = $4 where id_registroindicador = $1', [id_registroindicador,vr_numerador, vr_denominador, observacion]);
        return resultados;
    },

    async consultar_vigencia_año(profesional, id_indicador) {
        const resultados = await conexion.query("select to_char(f.fecha, 'YYYY') as periodo_año from schema_control.indicadores ind inner join schema_control.areas a on(ind.id_area = a.id_area) inner join schema_control.planes pa on(ind.id_plan = pa.id_plan) inner join schema_control.estrategias e on(pa.id_estrategia = e.id_estrategia) inner join schema_control.objetivos o on(e.id_objetivo = o.id_objetivo) inner join schema_control.lineas_acciones la on(o.id_linea_accion = la.id_linea) inner join schema_control.plangeneral pg on(la.id_plan_general = pg.id_plangeneral) inner join schema_control.fecha f on(pg.id_plangeneral = f.id_plan_general) inner join schema_control.profesionales p on(p.id_area_trabajo = a.id_area) where p.id_profesional = $1 and ind.id_indicador = $2 and pg.estado = true group by periodo_año ", [profesional, id_indicador]);
        return resultados.rows;
    },

    async consultar_vigenciaxreg_indicadores() {
        const resultados = await conexion.query("select distinct(vigencia) as año from schema_control.registroindicadores");
        return resultados.rows;
    },

    async consultar_periodoxaño(año, area, profesional, id_indicador) {
        const resultados = await conexion.query("select b.cod_mes, b.nombre_mes,b.id_mes  from schema_control.fecha a inner join schema_control.periodo_mes b on (to_char(fecha, 'MM')= b.cod_mes) where to_char(fecha, 'YYYY') = $5 and b.cod_mes not in( select e.cod_mes from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (b.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) where a.vigencia = $1 and d.id_area = $2 and a.id_profesional = $3 and a.id_indicador =$4 order by a.id_registroindicador ) group by b.id_mes, b.nombre_mes order by b.id_mes asc", [año, area, profesional, id_indicador, año]);
        return resultados.rows;
    },
    async consultar_periodoxañoedit(año, area, profesional, id_indicador) {
        const resultados = await conexion.query("select b.cod_mes, b.nombre_mes,b.id_mes  from schema_control.fecha a inner join schema_control.periodo_mes b on (to_char(fecha, 'MM')= b.cod_mes) where to_char(fecha, 'YYYY') = $5 and b.cod_mes  in( select e.cod_mes from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (b.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) where a.vigencia = $1 and d.id_area = $2 and a.id_profesional = $3 and a.id_indicador =$4 order by a.id_registroindicador ) group by b.id_mes, b.nombre_mes order by b.id_mes asc", [año, area, profesional, id_indicador, año]);
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

    async validacion_insert_respuesta_indicadores(vigencia, periodo, indicador, profesional) {
        const resultados = await conexion.query("select a.id_registroindicador, a.vigencia, e.nombre_mes, b.id_indicador, b.nombre_indicador, concat(u.nombre, ' ', u.apellido, ' ', u.num_identificacion) as nombre_profesional from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (b.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) where a.vigencia = $1 and e.id_mes = $2 and b.id_indicador = $3 and a.id_profesional = $4 and a.calificado = false order by a.id_registroindicador", [vigencia, periodo, indicador, profesional]);
        return resultados.rows;
    },


    async consultar_indicadorxVigencia_xPeriodo_xarea(vigencia, periodo, area) {
        const resultados = await conexion.query("select b.id_indicador, b.nombre_indicador from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (u.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) where a.vigencia = $1 and e.id_mes = $2 and d.id_area = $3 group by b.id_indicador,b.nombre_indicador order by b.id_indicador", [vigencia, periodo, area]);
        return resultados.rows;
    },

    async consultar_indicadorxperiodo_area(vigencia, periodo, area) {
        const resultados = await conexion.query("select b.id_indicador,b.nombre_indicador from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador=b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional=c.id_profesional) inner join schema_control.areas d on (b.id_area=d.id_area) inner join schema_control.periodo_mes e on(a.periodoevaluado=e.id_mes) where a.vigencia =$1 and e.id_mes = $2 and d.id_area =$3 order by a.id_registroindicador", [vigencia, periodo, area]);
        return resultados.rows;
    },


    async consultar_indicadorxarea(area) {
        const resultados = await conexion.query("select b.id_indicador,b.nombre_indicador,b.tipo_meta from schema_control.indicadores b where b.id_area =$1 ", [area]);
        return resultados.rows;
    },

    async consultar_det_indicador(vigencia, periodo, area, indicador) {
        const resultados = await conexion.query("select to_char(f.fecha, 'YYYY') as periodo_año, to_char(f.fecha, 'MM') as periodo_mes, ind.id_indicador, ind.nombre_indicador, ind.tipo_meta,ind.periodo_meta_num , ind.formula_literal_numerador, ind.formula_literal_denominador, ind.formula_literal_descriptiva, ind.meta_descriptiva, ind.meta_numerica from schema_control.indicadores ind inner join schema_control.areas a on(ind.id_area = a.id_area) inner join schema_control.planes pa on(ind.id_plan = pa.id_plan) inner join schema_control.estrategias e on(pa.id_estrategia = e.id_estrategia) inner join schema_control.objetivos o on(e.id_objetivo = o.id_objetivo) inner join schema_control.lineas_acciones la on(o.id_linea_accion = la.id_linea) inner join schema_control.plangeneral pg on(la.id_plan_general = pg.id_plangeneral) inner join schema_control.fecha f on(pg.id_plangeneral = f.id_plan_general) where to_char(f.fecha, 'YYYY') = $1 and to_char(f.fecha, 'MM') = $2 and a.id_area = $3 and ind.id_indicador = $4 and pg.estado = true group by periodo_mes, periodo_año, ind.id_indicador, ind.nombre_indicador ", [vigencia, periodo, area, indicador]);
        return resultados.rows;
    },

    async consultar_det_respuesta_indicador(id_registroindicador) {
        const resultados = await conexion.query("select r.id_registroindicador ,r.version, r.vigencia as periodo_año, r.periodoevaluado as periodo_mes, a.id_area, a.nombre_area,p.id_profesional, concat(u.nombre, ' ', u.apellido, ' ', u.num_identificacion) as nombre_profesional, ind.id_indicador, ind.nombre_indicador, ind.tipo_meta, ind.formula_literal_numerador, ind.formula_literal_denominador, ind.formula_literal_descriptiva, ind.meta_descriptiva, ind.meta_numerica from schema_control.registroindicadores r inner join schema_control.indicadores ind on (r.id_indicador = ind.id_indicador) inner join schema_control.areas a on (ind.id_area = a.id_area) inner join schema_control.profesionales p on (r.id_profesional = p.id_profesional ) inner join schema_seguridad.user u on (p.id_user = u.id_user) where r.id_registroindicador = $1 group by ind.id_indicador, ind.nombre_indicador, r.id_registroindicador, a.id_area, p.id_profesional, nombre_profesional", [id_registroindicador]);
        return resultados.rows;
    },


    //insertar_SoporteRegistroIndicador
    async insertar_SoporteRegistroIndicador(id_registro_indicador, nombre_soporte, ruta_digital, es_habilitado, extension, mimetype, es_valido, peso, nombre_original) {
        const resultados = await conexion.query('insert into schema_control.soporte (id_registro_indicador,nombre_soporte,ruta_digital,es_habilitado, extension, mime_type,fecha_carga, es_valido,peso, nombre_original) values ($1,$2,$3,$4,$5,$6,current_timestamp,$7,$8,$9)', [id_registro_indicador, nombre_soporte, ruta_digital, es_habilitado, extension, mimetype, es_valido, peso, nombre_original]);
        return resultados;
    },

    async consultar_reg_ind_xcal_filtrado(vigencia, mes, area, indicador) {
        const resultados = await conexion.query("select a.id_registroindicador, to_char(a.fecharegistro, 'YYYY-MM-DD HH12:MIPM') as fecharegistro,a.version,a.vigencia, e.nombre_mes, b.id_indicador, b.nombre_indicador, b.tipo_meta,b.meta_numerica, b.meta_descriptiva, b.formula_literal_descriptiva, b.formula_literal_numerador, b.formula_literal_denominador, a.observaciones, a.formula_cifras_numerador ,a.formula_cifras_denominador, u.num_identificacion, concat(u.nombre, ' ', u.apellido) as nombre_profesional, d.nombre_area from schema_control.registroindicadores a inner join schema_control.indicadores b on(a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on(a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on(c.id_user = u.id_user) inner join schema_control.areas d on(u.id_area = d.id_area) inner join schema_control.periodo_mes e on(a.periodoevaluado = e.id_mes) where a.vigencia = $1 and e.id_mes = $2 and d.id_area = $3 and b.id_indicador = $4 and a.calificado = '0' order by a.id_registroindicador ", [vigencia, mes, area, indicador]);
        return resultados.rows;
    },

    //consultar_reg_ind_xcalificar
    async consultar_reg_ind_xcalificar() {
        const resultados = await conexion.query("select a.id_registroindicador, a.version ,to_char(a.fecharegistro, 'YYYY-MM-DD HH12:MIPM') as fecharegistro, a.vigencia, e.nombre_mes, b.id_indicador, b.nombre_indicador, b.tipo_meta,b.meta_numerica, b.meta_descriptiva, b.formula_literal_descriptiva, b.formula_literal_numerador, b.formula_literal_denominador, a.observaciones, a.formula_cifras_numerador ,a.formula_cifras_denominador, u.num_identificacion, concat(u.nombre, ' ', u.apellido) as nombre_profesional, d.nombre_area from schema_control.registroindicadores a inner join schema_control.indicadores b on(a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on(a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on(c.id_user = u.id_user) inner join schema_control.areas d on(u.id_area = d.id_area) inner join schema_control.periodo_mes e on(a.periodoevaluado = e.id_mes) where a.calificado= '0' order by a.id_registroindicador ");
        return resultados.rows;
    },

    //consultar_det_reg_ind_xcalificar
    async consultar_det_reg_ind_xcalificar(id_reg_indicador) {
        const resultados = await conexion.query("select a.id_registroindicador,to_char(a.fecharegistro,'MON-DD-YYYY HH12:MIPM') as fecharegistro,a.vigencia, a.periodoevaluado, a.formula_cifras_numerador ,a.formula_cifras_denominador, a.observaciones ,a.calificado, a.version , e.nombre_mes, b.*, u.num_identificacion, concat(u.nombre, ' ', u.apellido) as nombre_profesional, d.nombre_area from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (u.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) where a.id_registroindicador = $1", [id_reg_indicador]);
        return resultados.rows;
    },

    async consultar_det_reg_ind_evaluacion(id_reg_indicador) {
        const resultados = await conexion.query("select a.id_registroindicador, a.periodoevaluado, a.id_profesional, a.id_indicador, to_char(a.fecharegistro, 'MON-DD-YYYY HH12:MIPM') as fecharegistro, a.vigencia, a.periodoevaluado, a.formula_cifras_numerador , a.formula_cifras_denominador, a.observaciones , a.calificado, a.version , e.nombre_mes, b.*, u.num_identificacion, concat(u.nombre, ' ', u.apellido) as nombre_profesional, d.nombre_area, cri.estado, to_char(cri.fecha_calificacion, 'MON-DD-YYYY HH12:MIPM') as fecha_calificacion from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (u.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) left join schema_control.calificacion_registro_indicadores cri on (cri.id_registro_indicador= a.id_registroindicador) where a.id_registroindicador = $1", [id_reg_indicador]);
        return resultados.rows;
    },

    async eliminar_Registro_RegIndicador(id) {
        const resultados = await conexion.query("delete from schema_control.registroindicadores where id_registroindicador= $1", [id]);
        return resultados;
    },

    async consultar_det_reg_ind_xcalificar(id_reg_indicador) {
        const resultados = await conexion.query("select a.id_registroindicador,to_char(a.fecharegistro,'MON-DD-YYYY HH12:MIPM') as fecharegistro,a.vigencia, a.periodoevaluado, a.formula_cifras_numerador ,a.formula_cifras_denominador, a.observaciones ,a.calificado, a.version , e.nombre_mes, b.*, u.num_identificacion, concat(u.nombre, ' ', u.apellido) as nombre_profesional, d.nombre_area from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (u.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) where a.id_registroindicador = $1", [id_reg_indicador]);
        return resultados.rows;
    },

//------------------------SOPORTES-----------------------------------------------

    async consultar_soportes_x_regIndicador(id_reg_indicador) {
        const resultados = await conexion.query("select s.*, to_char(s.fecha_carga, 'YYYY-MM-DD HH12:MIPM') fecha from schema_control.soporte s inner join schema_control.registroindicadores r on (s.id_registro_indicador = r.id_registroindicador) where s.id_registro_indicador = $1 and s.es_habilitado = '1' and s.es_valido = '1'", [id_reg_indicador]);
        return resultados.rows;
    },

    async consultar_soporte(id_soporte) {
        const resultados = await conexion.query("select s.* from schema_control.soporte s inner join schema_control.registroindicadores r on(s.id_registro_indicador = r.id_registroindicador) where s.id_soporte = $1 and s.es_habilitado ='1' and s.es_valido ='1'", [id_soporte]);
        return resultados.rows;
    },

    async actualizar_RegIndicador_calificado(id_reg_indicador) {
        const resultados = await conexion.query("update schema_control.registroindicadores set calificado='1' where id_registroindicador=$1 ", [id_reg_indicador]);
        return resultados;
    },

    //eliminar_soporte_x_idRegistroIndicador
    async eliminar_soporte_x_idRegistroIndicador(id) {
        const resultados = await conexion.query("delete from schema_control.soporte where id_registro_indicador= $1", [id]);
        return resultados;
    },

    async eliminar_soporte_x_idSoporte(id) {
        const resultados = await conexion.query("delete from schema_control.soporte where id_soporte= $1", [id]);
        return resultados;
    },
    

    //consultar_det_cal_x_regIndicador

    async consultar_det_cal_x_regIndicador(id_reg_indicador) {
        const resultados = await conexion.query("select cri.* from schema_control.calificacion_registro_indicadores cri left join schema_control.registroindicadores r on(cri.id_registro_indicador = r.id_registroindicador) where cri.id_registro_indicador =$1", [id_reg_indicador]);
        return resultados.rows;
    },


    //-----------------------Metodos PROFESIONALES--------------------------------------//
    //------------------------------------------------------------------------------//
    //consultar_RegistrosProfesionales
    async consultar_RegistrosProfesionales() {
        const resultados = await conexion.query("select u.*, a.nombre_area from schema_seguridad.user u inner join schema_control.areas a on (u.id_area = a.id_area) order by u.id_user");
        return resultados.rows;
    },
    async consultar_profesionalxarea(area) {
        const resultados = await conexion.query("select id_profesional, b.id_area, concat(u.nombre, ' ', u.apellido, ' ', u.num_identificacion) as nombre_profesional from schema_control.profesionales a inner join schema_seguridad.user u on(u.id_user=a.id_user) inner join schema_control.areas b on (u.id_area = b.id_area) where a.id_area_trabajo = $1 and u.es_profesional = '1'", [area]);
        return resultados.rows;
    },

    //consultar_RegistroAreas

    async consultar_RegistroAreas() {
        const resultados = await conexion.query("select id_area, nombre_area from schema_control.areas");
        return resultados.rows;
    },

    async consultar_roles() {
        const resultados = await conexion.query("select * from schema_seguridad.rol");
        return resultados.rows;
    },

    //insertar_Profesional
    async insertar_Profesional(rol, password,nombre_usuario,area_trabajo, nombres,apellidos,profesional,num_identificacion, tipo_identificacion,activo,correo,telefono) {
        const resultados = await conexion.query('INSERT INTO schema_seguridad.user (id_rol_user, password_, fecha, nombre_usuario, id_area, nombre, apellido, es_profesional, num_identificacion, tipo_identificacion, es_activo, correo, telefono) VALUES($1, $2, current_date, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', [rol, password,nombre_usuario,area_trabajo, nombres,apellidos,profesional,num_identificacion, tipo_identificacion,activo,correo,telefono]);
        return resultados;
    },


    async actualizar_profesional_x_id(id_user,rol, password,nombre_usuario,area_trabajo, nombres,apellidos,profesional,num_identificacion, tipo_identificacion,activo,correo,telefono) {
        const resultados = await conexion.query('update schema_seguridad.user set id_rol_user = $2, password_ = $3, nombre_usuario = $4, id_area = $5, nombre = $6, apellido = $7, es_profesional = $8, num_identificacion = $9, tipo_identificacion = $10, es_activo = $11, correo = $12, telefono = $13 where id_user = $1', [id_user,rol, password,nombre_usuario,area_trabajo, nombres,apellidos,profesional,num_identificacion, tipo_identificacion,activo,correo,telefono]);
        return resultados;
    },
    //consultarProfesionalXidUsuario
    async consultarProfesionalXidUsuario(id_user) {
        const resultados = await conexion.query("select u.*, u.id_area as id_area_trabajo, a.nombre_area, r.nombre_rol, p.id_profesional from schema_seguridad.user u inner join schema_control.areas a on (u.id_area = a.id_area) inner join schema_seguridad.rol r on (r.id_rol = u.id_rol_user) inner join schema_control.profesionales p on (p.id_user=u.id_user) where u.id_user = $1 order by u.id_user", [id_user]);
        return resultados.rows;
    },

    async eliminarProfesional(id) {
        const resultados = await conexion.query("delete from schema_seguridad.user where id_user= $1", [id]);
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
        const resultados = await conexion.query('INSERT INTO schema_control.calificacion_registro_indicadores (id_registro_indicador, vr_numerador, vr_denominador, resultado_numerico, resultado_descriptivo, desviacion, comentario, estado, fecha_calificacion) values ($1, $2,$3,$4, $5, $6, $7, $8,current_timestamp)', [reg_indicador, vr_numerador, vr_denominador, resultado_numerico, resultado_descriptivo, desviacion, comentario, estado]);
        return resultados;
    },

    async consultar_registros_Calificados() {
        var version = '"version"';
        const resultados = await conexion.query("select c.id_profesional, a.version, a.id_indicador, a.periodoevaluado, a.id_registroindicador, to_char(a.fecharegistro, 'YYYY-MM-DD HH12:MIPM') as fecharegistro, to_char(f.fecha_calificacion, 'YYYY-MM-DD HH12:MIPM') as fecha_calificacion, a.vigencia, a.calificado, e.nombre_mes, e.id_mes , b.nombre_indicador, b.tipo_meta , a.formula_cifras_numerador, a.formula_cifras_denominador, a.observaciones, d.nombre_area , concat(u.nombre, ' ', u.apellido, ' ', u.num_identificacion) as nombre_profesional, (case when f.estado = true then 'Si' else 'No' end)::text as estado from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (b.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) left join schema_control.calificacion_registro_indicadores f on (a.id_registroindicador = f.id_registro_indicador) where a.calificado = '1' and a.id_registroindicador in ( select reg_ind.id_registroindicador from schema_control.registroindicadores reg_ind inner join ( select a2.id_indicador, a2.periodoevaluado, a2.vigencia, a2.id_profesional, max(a2.version) as "+version+" from schema_control.registroindicadores a2 inner join schema_control.indicadores b2 on (a2.id_indicador = b2.id_indicador) inner join schema_control.profesionales c2 on (a2.id_profesional = c2.id_profesional) inner join schema_seguridad.user u2 on (c2.id_user = u2.id_user) inner join schema_control.areas d2 on (b2.id_area = d2.id_area) inner join schema_control.periodo_mes e2 on (a2.periodoevaluado = e2.id_mes) where a2.calificado = 'true' group by a2.id_indicador, a2.periodoevaluado, a2.vigencia, a2.id_profesional)t1 on (t1.id_indicador = reg_ind.id_indicador) and (t1.periodoevaluado = reg_ind.periodoevaluado) and (t1.vigencia = reg_ind.vigencia) and (t1.id_profesional = reg_ind.id_profesional) and (t1.version = reg_ind.version) ) order by a.vigencia, e.id_mes, a.id_registroindicador asc");
        return resultados.rows;
    },

    async consultar_calificacion_reg_indicador(id) {
        const resultados = await conexion.query("select a.id_registroindicador, to_char(a.fecharegistro, 'MON-DD-YYYY HH12:MIPM') as fecharegistro, a.vigencia, a.periodoevaluado, a.formula_cifras_numerador , a.formula_cifras_denominador, a.observaciones , a.calificado, a.version , e.nombre_mes, b.*, u.num_identificacion, concat(u.nombre, ' ', u.apellido) as nombre_profesional, d.nombre_area, f.* from schema_control.registroindicadores a inner join schema_control.indicadores b on (a.id_indicador = b.id_indicador) inner join schema_control.profesionales c on (a.id_profesional = c.id_profesional) inner join schema_seguridad.user u on (c.id_user = u.id_user) inner join schema_control.areas d on (u.id_area = d.id_area) inner join schema_control.periodo_mes e on (a.periodoevaluado = e.id_mes) left join schema_control.calificacion_registro_indicadores f on (a.id_registroindicador = f.id_registro_indicador) where a.id_registroindicador = $1", [id]);
        return resultados.rows;
    },


    //------------------TRAZABILIDAD-------------------------
    async consultar_trazabilidad_reg_indicador(id_indicador, profesional, vigencia, periodo) {
        const resultados = await conexion.query("select r.*, to_char(r.fecharegistro, 'YYYY-MM-DD HH12:MIPM')as fecharegistro2, cal.estado as estado, to_char(cal.fecha_calificacion, 'YYYY-MM-DD HH12:MIPM')as fecha_calificacion, cal.comentario, pm.nombre_mes, i.nombre_indicador from schema_control.registroindicadores r inner join schema_control.calificacion_registro_indicadores as cal on (cal.id_registro_indicador = r.id_registroindicador) inner join schema_control.periodo_mes pm on (r.periodoevaluado = pm.id_mes) inner join schema_control.indicadores i on(i.id_indicador = r.id_indicador) where r.id_indicador = $1 and r.id_profesional = $2 and r.vigencia = $3 and r.periodoevaluado = $4 union all select r2.*, to_char(r2.fecharegistro, 'YYYY-MM-DD HH12:MIPM')as fecharegistro2, 'false' as estado, 'Pendiente' as fecha_calificacion, 'Pendiente', pm2.nombre_mes, i2.nombre_indicador from schema_control.registroindicadores r2 inner join schema_control.periodo_mes pm2 on (r2.periodoevaluado = pm2.id_mes) inner join schema_control.indicadores i2 on(i2.id_indicador = r2.id_indicador) where r2.id_indicador = $1 and r2.id_profesional = $2 and r2.vigencia = $3 and r2.periodoevaluado = $4 and r2.id_registroindicador not in( select r3.id_registroindicador from schema_control.registroindicadores r3 inner join schema_control.calificacion_registro_indicadores as cal3 on (cal3.id_registro_indicador = r3.id_registroindicador) where r3.id_indicador = $1 and r3.id_profesional = $2 and r3.vigencia = $3 and r3.periodoevaluado = $4)", [id_indicador, profesional, vigencia, periodo]);
        return resultados.rows;
    },

    //------------------PERMISOS----------------------
    async consultarPermisosRol(rol) {
        const resultados = await conexion.query("select p.id_permiso, p.nombre_permiso, p.codigo, p.modulo, p.activo ,p.descripcion from schema_seguridad.user u inner join schema_seguridad.rol r on (u.id_rol_user = r.id_rol) inner join schema_seguridad.permiso_rol pr on (r.id_rol = pr.id_rol_fk) inner join schema_seguridad.permiso p on (pr.id_rol_fk = u.id_rol_user and pr.id_permiso_fk = p.id_permiso) where r.rol = $1 group by p.id_permiso, p.nombre_permiso, p.codigo order by p.id_permiso ", [rol]);
        return resultados.rows;
    },

    async consultarPermisosAsignar(rol) {
        const resultados = await conexion.query("select p.descripcion , p.id_permiso, p.nombre_permiso, p.codigo, p.modulo, 0 as activo from schema_seguridad.permiso p where p.id_permiso not in ( select p2.id_permiso from schema_seguridad.user u2 inner join schema_seguridad.rol r2 on (u2.id_rol_user = r2.id_rol) inner join schema_seguridad.permiso_rol pr2 on (r2.id_rol = pr2.id_rol_fk) inner join schema_seguridad.permiso p2 on (pr2.id_rol_fk = u2.id_rol_user and pr2.id_permiso_fk = p2.id_permiso) where r2.id_rol = $1 group by p2.id_permiso, p2.nombre_permiso, p2.codigo ) union all select p.descripcion, p.id_permiso, p.nombre_permiso, p.codigo, p.modulo, 1 as activo from schema_seguridad.user u inner join schema_seguridad.rol r on (u.id_rol_user = r.id_rol) inner join schema_seguridad.permiso_rol pr on (r.id_rol = pr.id_rol_fk) inner join schema_seguridad.permiso p on (pr.id_rol_fk = u.id_rol_user and pr.id_permiso_fk = p.id_permiso) where r.id_rol = $1 group by p.id_permiso, p.nombre_permiso, p.codigo order by id_permiso asc", [rol]);
        return resultados.rows;
    },

    
    async consultar_Permisos() {
        const resultados = await conexion.query("select p.* from  schema_seguridad.permiso p order by p.id_permiso ", []);
        return resultados.rows;
    },
    async insertarPermiso(id_permiso_fk, id_rol_fk) {
        const resultados = await conexion.query('insert into schema_seguridad.permiso_rol (id_permiso_fk, id_rol_fk) values ($1,$2)', [id_permiso_fk, id_rol_fk]);
        return resultados;
    },

    async eliminarPermiso(id_permiso_fk, id_rol_fk) {
        const resultados = await conexion.query('delete from schema_seguridad.permiso_rol where id_permiso_fk = $1 and id_rol_fk = $2 ', [id_permiso_fk, id_rol_fk]);
        return resultados;
    },
   

    //----------------Roles -----------------------
    
    async consultarRoles() {
        const resultados = await conexion.query("select * from schema_seguridad.rol r ", []);
        return resultados.rows;
    },
}