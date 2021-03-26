const { query } = require("./persistencia/conexion");
const conexion = require("./persistencia/conexion")

module.exports = {
    /*async insertar(nombre, precio) {
        let resultados = await conexion.query(`insert into productos
        (nombre, precio)
        values
        ($1, $2)`, [nombre, precio]);
        return resultados;
    },*/
    async obtenerRegistrosPlanos() {
        const resultados = await conexion.query("select * from schema_planos.registroplanos");
        return resultados.rows;
    },
    async obtenerIps() {
        const resultados = await conexion.query("select idips,codigo_ips,descripcion_ips from schema_bips.ips");
        return resultados.rows;
    },

    async obtenerPlanosCargados() {

    },

    async validarRegistrosAP(ips, fecha_inicial, fecha_fin) {        
        
        console.log(ips);
        console.log(fecha_inicial);
        console.log(fecha_fin);
        
        //const resultados = conexion.query('select count(ips)total_reg from schema_planos.registroplanos where ips = $1 and fecha_inicio = $2 and fecha_final = $3', [ips, fecha_inicial, fecha_fin]);        
        const resultados = conexion.query('select count(field_000)total_reg from schema_planos.plano_af where field_000 = $1 and (field_005 between $2 and $3)', [ips, fecha_inicial, fecha_fin]);
         
        return resultados;
        

        //console.log('\nSQL statement #3: ${sql}');
    },


    /*
    async obtenerPorId(id) {
        const resultados = await conexion.query(`select id, nombre, precio from productos where id = $1`, [id]);
        return resultados.rows[0];
    },*/
    
    async actualizar(id, nombre, precio) {
        const resultados = conexion.query(`update productos
        set nombre = $1,
        precio = $2
        where id = $3`, [nombre, precio, id]);
        return resultados;
    },
    async eliminar(id) {
        const resultados = conexion.query(`delete from productos
        where id = $1`, [id]);
        return resultados;
    },
}