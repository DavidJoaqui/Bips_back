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
        return resultados;
    },

    async eliminar_all_RegistrosPlanos_tmp() {
        const resultados = await conexion.query("delete from schema_planos.registros_planos_tmp where id_ips is not null");
        return resultados;
    },

    async validar_RegistrosPlanos_tmp(id_ips, nombre_archivo) {
        const resultados = await conexion.query("UPDATE schema_planos.registros_planos_tmp SET validado=true where id_ips= $1 and nombre_tmp= $2", [id_ips, nombre_archivo]);
        return resultados;
    },

    async ObtenerPlanos_validos() {
        const resultados = await conexion.query("select nombre_original from schema_planos.registros_planos_tmp where validado= true");
        return resultados.rows;
    },


    async validarPlanosNecesarios(planos_val) {
        console.log(planos_val);
        var cont_obligatorios = 0;
        if (planos_val.length >= 6) {
            // son necesarios AP, AC, AT, AH, AU, AF, no entra US, AN,CT,AM
            planos_val.forEach(plano => {
                if (plano["nombre_original"].slice(0, 2) == "AF") {
                    cont_obligatorios++;
                } else if (plano["nombre_original"].slice(0, 2) == "AP") {
                    cont_obligatorios++;
                } else if (plano["nombre_original"].slice(0, 2) == "AC") {
                    cont_obligatorios++;
                } else if (plano["nombre_original"].slice(0, 2) == "AT") {
                    cont_obligatorios++;
                } else if (plano["nombre_original"].slice(0, 2) == "AH") {
                    cont_obligatorios++;
                } else if (plano["nombre_original"].slice(0, 2) == "AU") {
                    cont_obligatorios++;
                }

            });

            if (cont_obligatorios == 6) {
                // 1: cumple, estan los archivos necesarios 
                return "1";
            }

        } else {
            // 0 : no cumple
            return "0";
        }
    }


}