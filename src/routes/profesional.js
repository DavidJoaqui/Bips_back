
const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");
const modelControlMando = require("../models/controlMandoModel");

// Ctm-profesionales

router.get("/ctm-profesionales", authMiddleware, (req, res) => {
    modelControlMando.consultar_roles().then((lista_roles) => {
      modelControlMando.consultar_RegistroAreas().then((lista_areas) => {
        res.render("paginas/ctm_profesionales", {
          user: req.session.user,
          lista_areas: lista_areas,
          lista_roles: lista_roles,
        });
      });
    });
  });
  
  router.get("/listado-ctm-profesionales", authMiddleware, (req, res) => {
    modelControlMando.consultar_RegistrosProfesionales().then((lista_prof) => {
      res.render("paginas/lista_ctm_profesionales", { lista_prof: lista_prof });
    });
  });
  
  router.post("/persistir-profesional/", authMiddleware, (req, res) => {

  
    modelControlMando
      .insertar_Profesional(
        req.query.rol,
        req.query.password,
        req.query.nombre_usuario,
        req.query.area_trabajo,
        req.query.nombres,
        req.query.apellidos,
        req.query.profesional,
        req.query.num_identificacion,
        req.query.tipo_identificacion,
        req.query.activo,
        req.query.correo,
        req.query.telefono
      )
      .then((respuesta) => {
        if (respuesta["command"] == "INSERT" && respuesta["rowCount"] > 0) {
          res.json({
            status: 200,
            msg:
              "El Profesional <b>" +
              req.query.nombres +
              " " +
              req.query.apellidos +
              "</b>, se creó correctamente...",
          });
        } else {

          res.json({
            status: 300,
            msg:
              "ERROR al crear el Profesional <b>" +
              req.query.nombres +
              " " +
              req.query.apellidos +
              "</b>, intente de nuevo...",
          });
        }
      })
      .catch((err) => {
        res.json({
          status: 500,
          msg:
            "ERROR!! El Profesional <b>" +
            req.query.nombres +
            " " +
            req.query.apellidos +
            " </b> YA EXISTE...",
        });
      });
  });
  
  router.post("/actualizar-profesional", authMiddleware, (req, res) => {

    modelControlMando
      .actualizar_profesional_x_id(
        req.query.id_user,
        req.query.rol,
        req.query.password,
        req.query.nombre_usuario,
        req.query.area_trabajo,
        req.query.txt_nombre,
        req.query.txt_apellido,
        req.query.profesional,
        req.query.txt_num_identificacion,
        req.query.tipo_identificacion,
        req.query.activo,
        req.query.correo,
        req.query.telefono
      )
      .then((respuesta) => {

        if (respuesta["command"] == "UPDATE" && respuesta["rowCount"] > 0) {

          res.send({
            status: 200,
            msg:
              "El usuario " +
              req.query.nombre_usuario +
              " fue actualizado correctamente...",
          });

        } else {

          res.send({
            status: 300,
            msg:
              "ERROR al actualizar el usuario <b>" +
              req.query.nombre_usuario +
              "</b> " +
              " intente de nuevo...",
          });
        }
      })
      .catch((err) => {
        res.json({
          status: 500,
          msg:
            "ERROR!! El usuario  <b>" +
            req.query.objetivo +
            "</b>, " +
            +"NO se pudo actualizar...",
        });
      });
  });
  
  router.post("/form-editar-ctm-profesional", authMiddleware, (req, res) => {
    modelControlMando
      .consultarProfesionalXidUsuario(req.query.id_user)
      .then((lista_usuarios) => {
        modelControlMando.consultar_RegistroAreas().then((lista_areas) => {
          modelControlMando.consultar_roles().then((lista_roles) => {

            res.render("paginas/editar_profesional", {
              id_user: req.query.id_user,
              lista_usuarios: lista_usuarios,
              lista_areas: lista_areas,
              lista_roles: lista_roles,
            });
          });
        });
      });
  });


  module.exports = router;