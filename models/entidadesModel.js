const conexion = require("./persistencia/conexion");


module.exports = {

    async insertar_registro_entidades(cod_entidad, nombre_entidad, tipo_reg,id) {
        const resultados = await conexion.query("insert into schema_bips.entidades(cod_entidad,nombre_entidad,tipo_reg,id_entidad) values ($1,$2,$3,$4)", [cod_entidad, nombre_entidad, tipo_reg,id]);
        return resultados;
    },

    async consultar_registro_entidades() {
        const resultados = await conexion.query("select e.id_entidad, e.cod_entidad , e.nombre_entidad ,r.des_regimen from schema_bips.entidades e inner join schema_bips.regimen r on (e.tipo_reg=r.tipo_regimen) order by e.nombre_entidad ASC");
        return resultados.rows;
    },

    async eliminar_registro_entidades(cod_entidad, regimen) {
        const resultados = await conexion.query("delete from schema_bips.entidades where cod_entidad= $1 and tipo_reg= $2 is not null", [cod_entidad, regimen]);
        return resultados;
    },
    async consultar_registro_entidad_x_id(id_entidad) {
        const resultados = await conexion.query("select e.id_entidad, e.cod_entidad , e.nombre_entidad ,e.tipo_reg from schema_bips.entidades e where id_entidad= $1", [id_entidad]);
        return resultados.rows;
    },
    async actualizar_registro_entidades(cod_entidad, nombre_entidad, tipo_reg,id) {
        const resultados = await conexion.query("update schema_bips.entidades SET cod_entidad = $1,nombre_entidad = $2 ,tipo_reg = $3 where id_entidad=$4", [cod_entidad, nombre_entidad, tipo_reg,id]);
        return resultados;
    },
    async obtener_mayor_id_entidad() {
        const resultados = await conexion.query("select  max(id_entidad) max from schema_bips.entidades;");
        return resultados.rows;
    },

}