const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const modelSecurity = require("../models/loginModel");
const modelControlMando= require("../models/controlMandoModel");
const config = require("../config/config");

router.get("/", (req, res) => {
  res.redirect("/login");
});

router.get("/login", (req, res) => {
  res.render(config.rutaPaginas + "login", { layout: false });
});

router.get("/inicio/bips", authMiddleware, (req, res) => {
  res.redirect("/login-data");
});

router.get("/login-data", (req, res) => {
  res.render(config.rutaPaginas + "inicio",  { user: req.session.username['nombre'], area: req.session.username['nombre_area'] });
});


router.post("/login-data", function (req, res) {

  modelSecurity
    .consultar_usuario_registrado(req.body.username)
    .then((user_reg) => {
      if (user_reg[0].total_usuarios == 0) {
        req.flash("error", " Usuario no registrado en el sistema Bips");
        return res.render(config.rutaPaginas + "login",{layout: false });
      } else {
        modelSecurity
          .validacion_user_password(req.body.username, req.body.password)
          .then((user_ok) => {
            if (user_ok[0].pwd == true) {


              if (user_ok[0].es_profesional) {
                modelControlMando
                  .consultarProfesionalXidUsuario(Number(user_ok[0].id))
                  .then((result) => {
                
                    modelControlMando
                      .consultar_areaxid(result[0].id_area_trabajo)
                      .then((area) => {
                        modelControlMando
                          .consultarPermisosRol(user_ok[0].rol)
                          .then((result_permisos) => {
                     
                            
                            var usuario = {
                              id_user: user_ok[0].id,
                              id_profesional: Number(result[0].id_profesional),
                              username: req.body.username,
                              id_area: user_ok[0].id_area,
                              nombre: user_ok[0].nombre,
                              nombre_rol: user_ok[0].nombre_rol,
                              rol: user_ok[0].rol,
                              permisos: result_permisos,
                              nombre_area: area[0].nombre_area,
                            };

                            req.session.user = user_ok[0].nombre_usuario;
                            req.session.admin = true;
                            req.session.web = "http://192.168.1.84:3000";
                            req.session.username = usuario;

                            req.flash(
                              "notify",
                              "Inicio de sesion con exito..."
                            );
    
                            return res.render(config.rutaPaginas + "inicio", {
                              user: req.session.username["nombre"],
                              area: req.session.username["nombre_area"],
                            });
      
                          });
                      });
                  });
              } else {
                var usuario = {
                  id: user_ok[0].id,
                  id_profesional: 0,
                  username: req.body.username,
                  id_area: user_ok[0].id_area,
                  nombre: user_ok[0].nombre,
                  nombre_rol: user_ok[0].nombre_rol,
                  rol: user_ok[0].rol,
                  permisos: {},
                };
                req.session.user = user_ok[0].nombre_usuario;
                req.session.admin = true;
                req.session.web = "http://192.168.1.84:3000";
                req.session.username = usuario;


                req.flash("notify", "Inicio de sesion con exito...");
                return res.render(config.rutaPaginas + "inicio", {
                  user: req.session.username["nombre"],
                  area: req.session.username["nombre_area"],
                });
              }
            } else {
              req.flash("error", " La contraseña ingresada es incorrecta");
              return res.render(config.rutaPaginas + "login", {layout: false });
            }
          });
      }
    });
});

// Logout endpoint
router.get("/logout", authMiddleware, (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;
