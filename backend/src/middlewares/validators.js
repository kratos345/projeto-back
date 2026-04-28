const { body } = require('express-validator');

exports.validateRegister = [
  body('name').trim().notEmpty().withMessage('Nome e obrigatorio.'),
  body('email').isEmail().withMessage('E-mail invalido.').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres.'),
];
exports.validateLogin = [
  body('email').isEmail().withMessage('E-mail invalido.').normalizeEmail(),
  body('password').notEmpty().withMessage('Senha e obrigatoria.'),
];
