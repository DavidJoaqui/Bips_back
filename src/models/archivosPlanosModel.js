const { query } = require("./persistencia/conexion");
const conexion = require("./persistencia/conexion");


module.exports = {


    async insertar_RegistrosPlanos_tmp(id_ips, nombre_ips, periodo_cargado, nombre_archivo, mimetypes, fecha_carga, validado, nombre_tmp, path_archivo) {
        const resultados = await conexion.query("insert into schema_planos.registros_planos_tmp (id_ips,nombre_ips,periodo_cargado,nombre_original,mimetypes,fecha_carga,validado,nombre_tmp,path_plano,en_error,path_error_plano) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,'false','')", [id_ips, nombre_ips, periodo_cargado, nombre_archivo, mimetypes, fecha_carga, validado, nombre_tmp, path_archivo]);
        return resultados;
    },

    async consultar_RegistrosPlanos_tmp() {
        const resultados = await conexion.query("select id_ips,nombre_ips,descripcion_ips,periodo_cargado,nombre_original,fecha_carga,validado,nombre_tmp,path_plano,cargado, en_error,path_error_plano from schema_planos.registros_planos_tmp inner join schema_bips.ips on(schema_bips.ips.codigo_ips =schema_planos.registros_planos_tmp.id_ips) order by schema_planos.registros_planos_tmp.nombre_original asc");
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

    async eliminar_all_RegistrosPlanos_tmp_validos() {
        const resultados = await conexion.query("delete from schema_planos.registros_planos_tmp where id_ips is not null and validado = true");
        return resultados;
    },

    async validar_RegistrosPlanos_tmp(id_ips, nombre_archivo) {
        const resultados = await conexion.query("UPDATE schema_planos.registros_planos_tmp SET validado=true where id_ips= $1 and nombre_tmp= $2", [id_ips, nombre_archivo]);
        return resultados;
    },

    async actualizar_carga_temp() {
        const resultados = await conexion.query("UPDATE schema_planos.registros_planos_tmp SET cargado=true where validado= true and id_ips is not null");
        return resultados;
    },

    async contar_Planos_Cargados() {
        const resultados = await conexion.query("select count(cargado) as total_cargados from schema_planos.registros_planos_tmp where cargado = true");
        return resultados;
    },

    async contar_Planos_Validados() {
        const resultados = await conexion.query("select count(validado) as total_validados from schema_planos.registros_planos_tmp where validado = true");
        return resultados.rows;
    },


    async ObtenerPlanos_validos() {
        const resultados = await conexion.query("select * from schema_planos.registros_planos_tmp where validado= true");
        return resultados.rows;
    },

    async cantidad_RegistrosPlanos_tmp() {
        const resultados = await conexion.query("select count(nombre_original) from schema_planos.registros_planos_tmp");
        return resultados.rows;
    },

    async obtener_plano_tmp(nombre_archivo_tmp) {
        const resultados = await conexion.query("select nombre_original,nombre_tmp,path_plano,validado from schema_planos.registros_planos_tmp where nombre_tmp = $1", [nombre_archivo_tmp]);
        return resultados.rows;
    },


    async validarPlanosCargados(planos) {
        var cont = 0;

        planos.forEach(plano => {

            if (plano["cargado"] == true) {
                cont++;
            }

        });

        if (cont == 10) {
            return 0;
        } else {
            return 1;
        }



    },

    async validarPlanosNecesarios(planos_val) {
        var cont_obligatorios = 0;
        if (planos_val.length == 10) {
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
                } else if (plano["nombre_original"].slice(0, 2) == "AN") {
                    cont_obligatorios++;
                } else if (plano["nombre_original"].slice(0, 2) == "US") {
                    cont_obligatorios++;
                } else if (plano["nombre_original"].slice(0, 2) == "AH") {
                    cont_obligatorios++;
                } else if (plano["nombre_original"].slice(0, 2) == "AM") {
                    cont_obligatorios++;
                }

            });

            if (cont_obligatorios = 10) {
                // 1: cumple, estan los archivos necesarios 
                return 1;
            } else {
                return 0;
            }

        } else {
            // 0 : no cumple
            // console.log("entra  a return");
            return 0;

        }
    },


    async eliminarPlanosValidosTmp() {

        const resultados = await conexion.query("delete from schema_planos.registros_planos_tmp where validado = true");
        return resultados;
    },

    //actualizarErrorRegistroPlanoTmp

    async actualizarErrorRegistroPlanoTmp(id_ips, nombre_archivo,path_error_plano) {
        const resultados = await conexion.query("UPDATE schema_planos.registros_planos_tmp SET validado=false, en_error=true,path_error_plano=$3  where id_ips= $1 and nombre_tmp= $2", [id_ips, nombre_archivo, path_error_plano]);
        return resultados;
    },

}