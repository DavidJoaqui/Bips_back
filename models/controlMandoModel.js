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
    }

}