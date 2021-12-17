const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");
const { exit } = require("process");


router.get("/reportes-pentaho/loading", authMiddleware, (req, res) => {
  res.end("No hay reporte asociado");
});

router.get("/reportes-pentaho", authMiddleware, (req, res) => {
  res.render(config.rutaPaginas + "reportePentaho", {
    user: req.session.user,
    area: req.session.username["nombre_area"],
  });
});

router.get("/reportes-pentaho/:area", authMiddleware, (req, res) => {
  res.render(config.rutaPartials + "reportePentaho/view", {
    layout: false,
    area: req.params.area,
  });
});

///ejecutar-update-presupuesto
router.post("/ejecutar-update-presupuesto/:fecha", authMiddleware, (req, res) => {

        let fecha = new Date(req.params.fecha+ " 00:00:00");

        let fecha_format = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();
        
        console.log(fecha_format);
        

  console.log("================Inicia ejecucion de la transformacion      =================");
            console.log("fecha/hora de inicio de la ejecucion : ");
            var now = new Date();
            console.log(now.toUTCString());
  console.log("===========================================================================");

  var spawn = require('child_process').spawn;

  var spawn_trs = spawn('cmd.exe', ['/c', "F:/data-integration/pan.bat /file=E:/Dato_BI/Bips_back/src/IntegracionKtr/tras-PrAwa.ktr "+'"'+fecha_format+'" "'+fecha_format+'"'+" /level=Detailed >> E:/Dato_BI/temp/log_tras_PrAwa.log"], {
    windowsVerbatimArguments: true
  });

  spawn_trs.stdout.pipe(process.stdout);

  spawn_trs.stdout.setEncoding('utf8');

  spawn_trs.stderr.setEncoding('utf8');


    spawn_trs.stdout.on('data', data => {
      console.log(`stdout:\n${data}`)
  });
  spawn_trs.stderr.on('data', (data) => {
      // console.error(`stderr: ${data}`);
  });



  spawn_trs.on('close', (code) => {

      console.log("===========================================================================");
      console.log("================   FIN ejecucion de la transformacion      =================");
      console.log("fecha/hora fin de la ejecucion: ");
      //console.log(obtener_fecha_hora());
      console.log(now.toUTCString());
      console.log("===========================================================================");
      console.log("resultado de la ejecucion: ");
      console.log(code)

      if (code == 0) {
         //Se retorna el codigo de estado capturado por el buffer para validar si la transformacion se ejecuto con Exito code: 0
         //OK : 0
        console.log("El comando/transformacion se ejecuto con exito... estado: " + code);

        return res.status(200)
                            .send(
                                 {msg:"La actuaización del reporte de presupuesto se realizo con Exito", estado: 200 }
                                        );


      }else{
        console.error('Ocurrio un problema con la ejecucion del comando/transformacion ' + code);
           //se retorna el codigo de estado de errro
          //return 1;
          return res.status(200).send({msg: "Ocurrio un problema al ejecutar --> la transformacion de actualización REPORTE PRESUPUESTO, problema con la transformacion, COD_ERR " + code, estado: 500});                    

      }
});

  spawn_trs.on('exit', (code) => {
    console.log(`exit child process exited with code ${code}`);
    //return code;
  });

});
module.exports = router;
