const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ message: 'Token nao fornecido.' });
  try {
    const token = header.split(' ')[1];
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(id);
    if (!req.user) return res.status(401).json({ message: 'Usuario nao encontrado.' });
    next();
  } catch {
    res.status(401).json({ message: 'Token invalido ou expirado.' });
  }
};
