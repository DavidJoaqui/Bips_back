const { query } = require("./persistencia/conexion");
const conexion = require("./persistencia/conexion");


module.exports = {

    //-----------------------Metodos Plan General-----------------------------------//
    //------------------------------------------------------------------------------//

    async insertar_PlanGeneral(plan_general) {
        const resultados = await conexion.query('insert into schema_control.plangeneral (plan_general) values ($1)', [plan_general]);
        return resultados;
    },

    async consultar_RegistrosPlan_General() {
        const resultados = await conexion.query("select id_plangeneral,plan_general from schema_control.plangeneral");
        return resultados.rows;
    },

    async eliminar_RegistroPlan_General(id_ips, nombre_archivo) {
        const resultados = await conexion.query("delete from schema_planos.registros_planos_tmp where id_ips= $1 and nombre_tmp= $2", [id_ips, nombre_archivo]);
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

    async obtener_mayor_id_lineaAccion() {
        const resultados = await conexion.query("select MAX(id_linea) max from schema_control.lineas_acciones;");
        return resultados.rows;
    },

    async insertar_lineaAccion(linea_accion, id_plangeneral) {
        const resultados = await conexion.query('insert into schema_control.lineas_acciones (linea_accion,id_plan_general) values ($1,$2)', [linea_accion, id_plangeneral]);
        return resultados;
    },




    //-----------------------Metodos OBJETIVOS--------------------------------------//
    //------------------------------------------------------------------------------//
    //consultar_RegistrosObjetivos

    async consultar_ObjetivosXlinea(id_linea_accion) {
        const resultados = await conexion.query("select * from schema_control.objetivos" );
        return resultados.rows;
    },

    async consultar_RegistrosObjetivos() {
        const resultados = await conexion.query("select obj.id_linea_accion ,obj.id_objetivo, obj.objetivo, t2.linea_accion as desc_linea_accion from schema_control.objetivos obj inner join(select t1.id_linea,concat(t1.linea_accion,' (',t1.plan_general,')') as linea_accion from (select pg.plan_general,la.linea_accion, la.id_linea from schema_control.lineas_acciones la inner join schema_control.plangeneral pg on(la.id_plan_general=id_plangeneral) order by la.id_linea asc)t1)t2  on(obj.id_linea_accion=t2.id_linea)");
        return resultados.rows;
    },


    async consultar_RegistrosObjetivos__LineasAccion() {
        const resultados = await conexion.query("select t1.id_linea,concat(t1.linea_accion,' (',t1.plan_general,')') as linea_accion from (select pg.plan_general,la.linea_accion, la.id_linea from schema_control.lineas_acciones la inner join schema_control.plangeneral pg on(la.id_plan_general=id_plangeneral) order by la.id_linea asc)t1");
        return resultados.rows;
    },

    //obtener_mayor_id_Objetivos
    async obtener_mayor_id_Objetivos() {
        const resultados = await conexion.query("select MAX(id_objetivo) max from schema_control.objetivos;");
        return resultados.rows;
    },

    async insertar_Objetivo( objetivo, id_linea_accion) {
        const resultados = await conexion.query('insert into schema_control.objetivos (objetivo,id_linea_accion) values ($1,$2)', [ objetivo, id_linea_accion]);
        return resultados;
    },



    
    //-----------------------Metodos ESTRATEGIAS--------------------------------------//
    //------------------------------------------------------------------------------//

    async consultar_RegistrosObjetivosxlineas() {
        const resultados = await conexion.query("select * from schema_control.objetivos a inner join schema_control.lineas_acciones b on (a.id_linea_accion=b.id_linea)");
        return resultados.rows;
    },
 
    async insertar_estrategia(estrategia, id_objetivo) {
        const resultados = await conexion.query('insert into schema_control.estrategias (estrategia,id_objetivo) values ($1,$2)', [estrategia,id_objetivo]);
        return resultados;
    },

    async consultar_RegistrosEstrategias() {
        const resultados = await conexion.query("select a.id_estrategia,a.estrategia, b.id_objetivo, b.objetivo from schema_control.estrategias a inner join schema_control.objetivos b on (a.id_objetivo=b.id_objetivo)");
        return resultados.rows;
    },

    

    //---------------------------Metodos PLanes--------------------------------------//
    //------------------------------------------------------------------------------//

    
    async insertar_plan(plan, id_estrategia) {
        const resultados = await conexion.query('insert into schema_control.planes (plan,id_estrategia) values ($1,$2)', [plan,id_estrategia]);
        return resultados;
    },

    async consultar_RegistroPlanes() {
        const resultados = await conexion.query("select * from schema_control.planes");
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
    async insertar_indicador(nombre_area) {
        const resultados = await conexion.query('insert into schema_control.areas (nombre_area) values ($1)', [nombre_area]);
        return resultados;
    },

    async consultar_Indicadores() {
        const resultados = await conexion.query("select * from schema_control.indicadores");
        return resultados.rows;
    },




    //-----------------------Metodos PROFESIONALES--------------------------------------//
    //------------------------------------------------------------------------------//
    //consultar_RegistrosProfesionales
    async consultar_RegistrosProfesionales() {
        const resultados = await conexion.query("select p.num_identificacion,p.nombres, p.apellidos, a.nombre_area from schema_control.profesionales p inner join schema_control.areas a on(p.id_area_trabajo=a.id_area) order by p.id_profesional ASC");
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

}