const conexion = require("./persistencia/conexion");


module.exports = {


    async validacion_user_password(nombre_user,passwd) {
        //console.log("consul param"+nombre_user+passwd)

        
        const resultados = await conexion.query('select password_ = md5($2)as pwd from schema_seguridad.user where rol_name = $1', [nombre_user,passwd]);
        return resultados.rows;
    }  

}
