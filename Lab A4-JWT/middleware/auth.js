// middleware/auth.js
const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    req.flash("error_msg", "You must login first");
    return res.redirect("/auth/login");
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    req.flash("error_msg", "Access Denied. Admin only.");
    return res.redirect("/");
  }
  next();
};

module.exports = { isLoggedIn, isAdmin };