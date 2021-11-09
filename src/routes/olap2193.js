const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const config = require("../config/config");

router.get("/olap-2193", authMiddleware, (req, res) => {
  res.render(config.rutaPaginas + "olap2193", {
    user: req.session.user,
    area: req.session.username["nombre_area"],
  });
});

module.exports = router;