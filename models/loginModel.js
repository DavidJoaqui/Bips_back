const conexion = require("./persistencia/conexion");


module.exports = {


    async validacion_user_password(nombre_user, passwd) {
        //console.log("consul param"+nombre_user+passwd)


        const resultados = await conexion.query("select id_user as id, id_area as id_area,concat(nombre,' ', apellido) as nombre , password_ = md5($2)as pwd,nombre_usuario,es_profesional from schema_seguridad.user where rol_name = $1", [nombre_user, passwd]);
        return resultados.rows;
    },
    async consultar_usuario_registrado(nombre_user) {
        const resultados = await conexion.query("select count(*)total_usuarios from schema_seguridad.user where rol_name = $1", [nombre_user]);
        return resultados.rows;
    },



}