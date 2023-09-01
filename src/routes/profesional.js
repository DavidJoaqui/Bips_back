const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");
const modelControlMando = require("../models/controlMandoModel");

router.get("/ctm-profesionales", authMiddleware, (req, res) => {
  modelControlMando.consultar_RegistrosProfesionales().then((lista_prof) => {
    res.render(config.rutaPartials + "profesional/list", { 
      layout: false,
      list: lista_prof });
  });
});

router.get("/usuarios", authMiddleware, (req, res) => {
  modelControlMando.consultar_RegistrosProfesionales().then((lista_prof) => {
    res.render(config.rutaPartials + "profesional/index", { 
      user: req.session.username["nombre"],
      nombre_rol: req.session.username["nombre_rol"],
      rol: req.session.username["rol"],
      permisos: req.session.username["permisos"],
      area: req.session.username["nombre_area"],
      list: lista_prof });
  });
});



router.post("/persistir-profesional/", authMiddleware, (req, res) => {
  modelControlMando
    .insertar_Profesional(
      req.body.rol,
      req.body.password,
      req.body.usuario,
      req.body.area_trabajo,
      req.body.nombre,
      req.body.apellido,
      req.body.profesional,
      req.body.num_identificacion,
      req.body.tipo_identificacion,
      req.body.activo,
      req.body.correo,
      req.body.telefono
    )
    .then((respuesta) => {
      if (respuesta["command"] == "INSERT" && respuesta["rowCount"] > 0) {
        return res.status(200).send("Ok");
      } else {
        return res.status(400).send("Error al guardarla entidad");
      }
    })
    .catch((err) => {
      return res.status(500).send("Error al guardar datos");
    });
});

router.put("/actualizar-profesional", authMiddleware, (req, res) => {
  modelControlMando
    .actualizar_profesional_x_id(
      req.body.id_user,
      req.body.rol,
      req.body.password,
      req.body.usuario,
      req.body.area_trabajo,
      req.body.nombre,
      req.body.apellido,
      req.body.profesional,
      req.body.num_identificacion,
      req.body.tipo_identificacion,
      req.body.activo,
      req.body.correo,
      req.body.telefono
    )
    .then((respuesta) => {
      if (respuesta["command"] == "UPDATE" && respuesta["rowCount"] > 0) {
        return res.status(200).send("Ok");
      } else {
        return res.status(400).send("Error al guardarla entidad");
      }
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).send("Error al guardar datos");
    });
});

router.get("/form-ctm-profesional/:id", authMiddleware, (req, res) => {
  modelControlMando
    .consultarProfesionalXidUsuario(req.params.id)
    .then((lista_usuarios) => {
      modelControlMando.consultar_RegistroAreas().then((lista_areas) => {
        modelControlMando.consultar_roles().then((lista_roles) => {
          res.render(config.rutaPartials + "profesional/form", {
            layout: false,
            id_user: req.params.id,
            item: lista_usuarios,
            lista_areas: lista_areas,
            lista_roles: lista_roles,
          });
        });
      });
    });
});

router.delete(
  "/profesional/delete/:id/control-mando-bips",
  authMiddleware,
  function (req, res) {
    modelControlMando
      .eliminarProfesional(req.params.id)
      .then((respuesta) => {
        if (respuesta["command"] == "DELETE" && respuesta["rowCount"] > 0) {
          return res.status(200).send("Ok");
        } else {
          return res.status(400).send("Error al guardar datos");
        }
      }).catch((err) => {
        return res.status(500).send("Error al guardar datos");
      });
  }
);


module.exports = router;
