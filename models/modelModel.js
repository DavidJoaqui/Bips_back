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
<<<<<<< HEAD
        const resultados = await conexion.query("select idips,descripcion_ips from schema_bips.ips");
        return resultados.rows;
    },
    
    async validarRegistrosAP() {
        
        const resultados = await conexion.query('select ips from schema_planos.registroplanos where ips = $3', [ips]);
        return resultados.rows;
        
    },
    

    
    
    
=======
        const resultados = await conexion.query("select idips,codigo_ips,descripcion_ips from schema_bips.ips");
        return resultados.rows;
    },

    async obtenerPlanosCargados() {

    }

>>>>>>> rdavid
    /*
    async obtenerPorId(id) {
        const resultados = await conexion.query(`select id, nombre, precio from productos where id = $1`, [id]);
        return resultados.rows[0];
    },/*
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
    },*/
}