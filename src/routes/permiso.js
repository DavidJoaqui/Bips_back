const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");
const modelControlMando = require("../models/controlMandoModel");


router.get("/permisos-bips", authMiddleware, (req, res) => {
  //consultarRoles
  modelControlMando.consultarRoles().then((lista_roles) => {
    modelControlMando.consultar_Permisos().then((lista_permisos) => {
      res.render("paginas/permisos_bips", {
        nombre_rol: req.session.username["nombre_rol"],
        user: req.session.username["nombre"],
        rol: req.session.username["rol"],
        area: req.session.username["nombre_area"],
        lista_roles: lista_roles,
        lista_permisos: lista_permisos,
      });
    });
  });
});


  router.get("/ctm-lista-permisos-rol/:id_rol", authMiddleware, (req, res) => {
    // Consultar roles
    modelControlMando
      .consultarPermisosAsignar(Number(req.params.id_rol))
      .then((lista_permisos) => {
        console.log(lista_permisos);
        res.render("paginas/lista_permisos", {
          lista_permisos: lista_permisos,
        });
      });
  });
  
  router.get("/listado-ctm-permisos", authMiddleware, (req, res) => {
    modelControlMando.consultar_Permisos().then((lista_permisos) => {
      res.render("paginas/lista_permisos", { lista_permisos: lista_permisos });
    });
  });
  
  router.post("/persistir-permiso/", authMiddleware, (req, res) => {


    modelControlMando
      .insertarPermiso(req.query.id_permiso, req.query.rol)
      .then((respuesta) => {
        if (respuesta["command"] == "INSERT" && respuesta["rowCount"] > 0) {
          console.log("OK... insert Nuevo permiso");
          res.json({ status: 200, msg: "Permiso activado..." });
        } else {
          res.json({
            status: 300,
            msg: "ERROR al activar el Permiso , intente de nuevo...",
          });
        }
      })
      .catch((err) => {
        res.json({
          status: 500,
          msg: "ERROR!! El Permiso no se pudo almacenar...",
        });
      });
  });
  
  router.post("/eliminar-permiso/", authMiddleware, (req, res) => {

    modelControlMando
      .eliminarPermiso(req.query.id_permiso, req.query.rol)
      .then((respuesta) => {
        if (respuesta["command"] == "DELETE" && respuesta["rowCount"] > 0) {
          console.log("OK... delete permiso");
          res.json({ status: 200, msg: "Permiso Desactivado ..." });
        } else {
          res.json({
            status: 300,
            msg: "ERROR al desactivar el Permiso , intente de nuevo...",
          });
        }
      })
      .catch((err) => {
        res.json({
          status: 500,
          msg: "ERROR!! El Permiso no se pudo desactivar...",
        });
      });
  });
  
module.exports = router;