// src/middlewares/roleMiddleware.js

exports.roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    next();
  };
};