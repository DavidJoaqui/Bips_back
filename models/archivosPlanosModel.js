const { query } = require("./persistencia/conexion");
const conexion = require("./persistencia/conexion");


module.exports = {


    async insertar_RegistrosPlanos_tmp(id_ips, nombre_ips, periodo_cargado, nombre_archivo, mimetypes, fecha_carga, validado, nombre_tmp) {
        const resultados = await conexion.query('insert into schema_planos.registros_planos_tmp (id_ips,nombre_ips,periodo_cargado,nombre_original,mimetypes,fecha_carga,validado,nombre_tmp) values ($1,$2,$3,$4,$5,$6,$7,$8)', [id_ips, nombre_ips, periodo_cargado, nombre_archivo, mimetypes, fecha_carga, validado, nombre_tmp]);
        return resultados;
    },

    async consultar_RegistrosPlanos_tmp() {
        const resultados = await conexion.query("select * from schema_planos.registros_planos_tmp");
        return resultados.rows;
    },

    async eliminar_RegistrosPlanos_tmp(id_ips, nombre_archivo) {
        const resultados = await conexion.query("delete from schema_planos.registros_planos_tmp where id_ips= $1 and nombre_tmp= $2", [id_ips, nombre_archivo]);
        return resultados.rows;
    },

    async validar_RegistrosPlanos_tmp(id_ips, nombre_archivo) {
        const resultados = await conexion.query("UPDATE schema_planos.registros_planos_tmp SET validado=true where id_ips= $1 and nombre_tmp= $2", [id_ips, nombre_archivo]);
        return resultados.rows;
    },

    async cantidad_RegistrosPlanos_tmp() {
        const resultados = await conexion.query("select count(nombre_original) from schema_planos.registros_planos_tmp");
        return resultados.rows;
    },
    

    


}