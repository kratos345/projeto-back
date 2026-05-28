const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não enviado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET || 'dev_secret_123';
    const decoded = jwt.verify(token, secret);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};