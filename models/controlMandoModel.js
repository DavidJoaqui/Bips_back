const { query } = require("./persistencia/conexion");
const conexion = require("./persistencia/conexion");


module.exports = {


    async insertar_PlanGeneral(id_plangeneral, plan_general) {
        const resultados = await conexion.query('insert into schema_control.plangeneral (id_plangeneral,plan_general) values ($1,$2)', [id_plangeneral, plan_general]);
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

    async insertar_lineaAccion(id_linea, linea_accion, id_plangeneral) {
        const resultados = await conexion.query('insert into schema_control.lineas_acciones (id_linea,linea_accion,id_plan_general) values ($1,$2,$3)', [id_linea, linea_accion, id_plangeneral]);
        return resultados;
    },




    //-----------------------Metodos OBJETIVOS--------------------------------//
    //------------------------------------------------------------------------------//
    //consultar_RegistrosObjetivos

    async consultar_RegistrosObjetivos() {
        const resultados = await conexion.query("select obj.id_linea_accion ,obj.id_objetivo, obj.objetivo, t2.linea_accion as desc_linea_accion from schema_control.objetivos obj inner join(select t1.id_linea,concat(t1.linea_accion,' (',t1.plan_general,')') as linea_accion from (select pg.plan_general,la.linea_accion, la.id_linea from schema_control.lineas_acciones la inner join schema_control.plangeneral pg on(la.id_plan_general=id_plangeneral) order by la.id_linea asc)t1)t2  on(obj.id_linea_accion=t2.id_linea)");
        return resultados.rows;
    },

    async consultar_RegistrosObjetivos__LineasAccion() {
        const resultados = await conexion.query("select t1.id_linea,concat(t1.linea_accion,' (',t1.plan_general,')') as linea_accion from (select pg.plan_general,la.linea_accion, la.id_linea from schema_control.lineas_acciones la inner join schema_control.plangeneral pg on(la.id_plan_general=id_plangeneral) order by la.id_linea asc)t1");
        return resultados.rows;
    },

}