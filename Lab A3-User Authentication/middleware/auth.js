// isLoggedIn: any logged-in user can pass
const isLoggedIn = (req, res, next) => {
  if (req.session.user) return next();
  req.flash("error", "You must be logged in to access that page.");
  res.redirect("/auth/login");
};

// isAdmin: only users with role=admin can pass
const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === "admin") return next();
  req.flash("error", "Access Denied. Admins only.");
  res.redirect("/");
};

module.exports = { isLoggedIn, isAdmin };
