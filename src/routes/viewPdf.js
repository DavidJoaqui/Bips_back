const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");
const modelControlMando = require("../models/controlMandoModel");
const path = require("path");

router.get("/pdf/view/soporte/:id",authMiddleware, (req, res) => {

    const spawn = require('child_process').spawn;


    modelControlMando.consultar_soporte(req.params.id).then(lista_soportes => {
        console.log("" + lista_soportes[0].ruta_digital);
        //const spawn_cp = spawn('cmd.exe', ['/c', "C://test.bat"], { shell: true }, { stdio: 'inherit' });
        const spawn_cp = spawn('cmd.exe', ['/c', "C://bat_copy.bat", lista_soportes[0].ruta_digital, path.resolve(__dirname+ "../../", config.rutaPublicPdfjs)]);



        spawn_cp.stdout.on('data', (data) => {
            console.log("std OUT");
            console.log(data.toString())

        });
        spawn_cp.stderr.on('data', (data) => {
                console.log("std ERR");
                console.error(data.toString());
            })
            //res.send(stdout);

        spawn_cp.on('close', (code) => {
            console.log('OK.. code: ' + code);
            var preText = `Child exited with code ${code} : `;
            switch (code) {
                case 1:
                    console.info(preText + "El comando BATCH se ejecuto correctamente, Accion Ver PDF...");
                    
                    res.render(config.rutaPartials + "pdf/view", {
                        layout: false,                        
                        file_pdf: lista_soportes[0].nombre_soporte
                      });
                    
                    break;
                case 2:
                    console.info(preText + "The file already exists");
                    break;
                case 3:
                    console.info(preText + "The file doesn't exists and now is created");
                    break;
                case 4:
                    console.info(preText + "An error ocurred while creating the file");
                    break;
            }
        });

    });







    
  });

  module.exports = router;