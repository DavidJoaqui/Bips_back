const path = require('path');
const spawn = require('child_process').spawn;
const modelplanos_ = require(path.join(__dirname + '/archivosPlanosModel'));

const tras_AF = "tras-AF.ktr";
const tras_CT = "tras-CT.ktr";
const tras_US = "tras-US.ktr";
const tras_AC = "tras-AC.ktr";
const tras_AP = "tras-AP.ktr";
const tras_AU = "tras-AU.ktr";
const tras_AH = "tras-AH.ktr";
const tras_AT = "tras-AT.ktr";
const tras_AM = "tras-AM.ktr";
const tras_AN = "tras-AN.ktr";


module.exports = {

    async selecionaKtr(nombre_archivo_tmp, nombre_plano) {
        if (nombre_plano == 'AF') {this.ejecucionKtr(tras_AF,nombre_archivo_tmp);}
        if (nombre_plano == 'CT') {this.ejecucionKtr(tras_CT,nombre_archivo_tmp);}
        if (nombre_plano == 'US') {this.ejecucionKtr(tras_US,nombre_archivo_tmp);}
        if (nombre_plano == 'AC') {this.ejecucionKtr(tras_AC,nombre_archivo_tmp);}
        if (nombre_plano == 'AP') {this.ejecucionKtr(tras_AP,nombre_archivo_tmp);}
        if (nombre_plano == 'AU') {this.ejecucionKtr(tras_AU,nombre_archivo_tmp);}
        if (nombre_plano == 'AH') {this.ejecucionKtr(tras_AH,nombre_archivo_tmp);}
        if (nombre_plano == 'AT') {this.ejecucionKtr(tras_AT,nombre_archivo_tmp);}
        if (nombre_plano == 'AM') {this.ejecucionKtr(tras_AM,nombre_archivo_tmp);}
        if (nombre_plano == 'AN') {this.ejecucionKtr(tras_AN,nombre_archivo_tmp);} 

    },

    async ejecucionKtr(nombre_transformacion,nombre_archivo_tmp) {

        //buscar en bd el plano que llega como parametro y obtener el path del plano para pasar a la transformacion,
        //se debe verficar que el plano este validado


        modelplanos_.obtener_plano_tmp(nombre_archivo_tmp).then(rsta => {

            if (rsta[0]['validado'] == true) {


                //var prueba_3 = spawn('cd /var/lib/data-integration/; sh pan.sh -file="/archivos_bips/Trans_Archivos_Planos/Trans_archivosPlanos.ktr" -level=Error >> /archivos_bips/trans.log;', {encoding: 'utf8', stdio: 'ignore'});
                //const spawn_pr = spawn('sh pan.sh',['-file="/archivos_bips/Trans_Archivos_Planos/Trans_archivosPlanos.ktr']);
                //console.log(__dirname);.
                //console.log(rsta[0]['validado']);
                //console.log(rsta[0]['path_plano']);
                //var str=JSON.stringify(rsta,['path_plano']);
                //console.log(str);
                //console.log(Object.entries(str));

                //console.log(`value=${path_plano}`);
                var path_plano = rsta[0]['path_plano'];
                //console.log(path);


                //console.log(JSON.stringify(rsta));
                //console.log(JSON.parse(JSON.stringify(rsta)));
                //console.log(JSON.stringify(rsta,['path_plano']));
                console.log("===========================================================================");
                console.log("================Inicia ejecucion de la transforacion      =================");
                console.log("fecha/hora de inicio de la ejecucion : ");
                console.log(this.obtener_fecha_hora());
                console.log("===========================================================================");


                /*
                La función spawn lanza un comando en un nuevo proceso y podemos usarlo para pasarle cualquier argumento a ese comando
                
                */    
                const spawn_pr = spawn('sh', ['/var/lib/data-integration/pan.sh', "-file=src/IntegracionKtr/" + nombre_transformacion, '-level=Basic', "-param:ruta_archivo=" + path_plano, '-logfile=/tmp/trans.log']);
                //const spawn_pr = spawn('ls',['-ltr','/var/lib/data-integration']);

                //const spawn_pr = spawn('ls', ['-ltr']);

                spawn_pr.stdout.pipe(process.stdout);


                spawn_pr.stdout.on('data', data => {
                    console.log(`stdout:\n${data}`)
                });
                spawn_pr.stderr.on('data', (data) => {
                    console.error(`stderr: ${data}`);
                });

                spawn_pr.on('close', (code) => {

                    console.log("===========================================================================");
                    console.log("================   FIN ejecucion de la transforacion      =================");
                    console.log("fecha/hora fin de la ejecucion: ");
                    console.log(this.obtener_fecha_hora());
                    console.log("===========================================================================");
                    console.log("resultado de la ejecucion: ");

                    console.log(`child process exited with code ${code}`);

                    if (code == '0') {
                        console.log("El comando/transformacion se ejecuto con exito... estado: " + code);
                        console.log("===========================================================================");
                        console.log("================Inicia ejecucion de la job      =================");
                        console.log("fecha/hora de inicio de la ejecucion : ");
                        console.log(this.obtener_fecha_hora());
                        console.log("===========================================================================");
        
        
        
                        const spawn_job = spawn('sh', ['/var/lib/data-integration/kitchen.sh', "-file=/archivos_bips/Trans_Archivos_Planos/Job_reporte2193.kjb", '-level=Basic', '-logfile=/tmp/trans.log']);
                        //const spawn_job = spawn('ls',['-ltr','/var/lib/data-integration']);
        
                        //const spawn_job = spawn('ls', ['-ltr']);
        
                        spawn_job.stdout.pipe(process.stdout);
        
        
                        spawn_job.stdout.on('data', data => {
                            console.log(`stdout:\n${data}`)
                        });
                        spawn_job.stderr.on('data', (data) => {
                            console.error(`stderr: ${data}`);
                        });
        
                        spawn_job.on('close', (code) => {
        
                            console.log("===========================================================================");
                            console.log("================   FIN ejecucion de la job      =================");
                            console.log("fecha/hora fin de la ejecucion: ");
                            console.log(this.obtener_fecha_hora());
                            console.log("===========================================================================");
                            console.log("resultado de la ejecucion: ");
        
                            console.log(`child process exited with code ${code}`);
        
                            if (code == '0') {
                                console.log("El comando/transformacion se ejecuto con exito... estado: " + code);
                                
                            } else {
                                console.error('Ocurrio un problema con la ejecucion del comando/transformacion ' + code);
                            }                    
        
                        });

                        
                    } else {
                        console.error('Ocurrio un problema con la ejecucion del comando/transformacion ' + code);
                    }                    

                });




            } else {
                console.log("----------------------------------------------------------------------------------------------------");
                console.log("Se omite la ejecucion del comando/transformacion tras-AF.ktr para el archivo: " + nombre_plano) + " NO se encuentra validado...";
                console.log("----------------------------------------------------------------------------------------------------");
            }
        });

    },


    async obtener_fecha_hora() {

        let fech_now = Date.now();

        let date_ = new Date(fech_now);

        let fecha_completa = date_.getDate() + "/" + (date_.getMonth() + 1) + "/" + date_.getFullYear();
        let hora = date_.getHours() + ":" + date_.getMinutes() + ":" + date_.getSeconds();

        let fecha_hora = fecha_completa + " " + hora;

        return fecha_hora;

    },


    async ejecucionJob(nombre_transformacion,nombre_archivo_tmp) {



        

        
    }

}

