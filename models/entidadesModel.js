const conexion = require("./persistencia/conexion");


module.exports = {

    async insertar_registro_entidades(cod_entidad, nombre_entidad, tipo_reg) {
        const resultados = await conexion.query("insert into schema_bips.entidades(cod_entidad,nombre_entidad,tipo_reg) values ($1,$2,$3)", [cod_entidad, nombre_entidad, tipo_reg]);
        return resultados;
    },

    async consultar_registro_entidades() {
        const resultados = await conexion.query("select e.cod_entidad , e.nombre_entidad ,r.des_regimen from schema_bips.entidades e inner join schema_bips.regimen r on (e.tipo_reg=r.tipo_regimen)");
        return resultados.rows;
    },

    async eliminar_registro_entidades(cod_entidad, regimen) {
        const resultados = await conexion.query("delete from schema_bips.entidades where cod_entidad= $1 and tipo_reg= $2 is not null", [cod_entidad, regimen]);
        return resultados;
    },

}