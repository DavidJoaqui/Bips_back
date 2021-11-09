const auth = (req, res, next) => {
  if (req.session && req.session.admin) return next();
  else return res.redirect("/login");
};

module.exports = auth;
