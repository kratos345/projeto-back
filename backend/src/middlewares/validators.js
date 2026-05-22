const { body, validationResult } = require('express-validator');

exports.validateRegister = [
  body('name').trim().notEmpty().withMessage('Nome é obrigatório.'),
  body('email').isEmail().withMessage('E-mail inválido.').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres.'),
  body('confirmPassword').optional().custom((value, { req }) => value === req.body.password).withMessage('As senhas não coincidem.'),
  body('cpfCnpj').optional().trim().isLength({ min: 11 }).withMessage('CPF/CNPJ inválido.'),
  body('role').optional().isIn(['user', 'usuario', 'vendedor', 'admin', 'adm']).withMessage('Role inválido.'),
];

exports.validateLogin = [
  body('email').isEmail().withMessage('E-mail inválido.').normalizeEmail(),
  body('password').notEmpty().withMessage('Senha é obrigatória.'),
];

exports.validatePropertyCreate = [
  body('title').trim().isLength({ min: 10 }).withMessage('Título deve ter no mínimo 10 caracteres.'),
  body('price').isFloat({ min: 1 }).withMessage('Preço deve ser maior que zero.'),
  body('type').isIn(['Casa', 'Apartamento', 'Cobertura', 'Terreno', 'Comercial', 'Galpão']).withMessage('Tipo de imóvel inválido.'),
  body('address').trim().isLength({ min: 5 }).withMessage('Endereço deve ter no mínimo 5 caracteres.'),
  body('city').trim().isLength({ min: 3 }).withMessage('Cidade deve ter no mínimo 3 caracteres.'),
  body('state').trim().matches(/^[A-Z]{2}$/).withMessage('Estado deve ter 2 letras maiúsculas.'),
  body('bedrooms').optional().isInt({ min: 0 }).withMessage('Quartos não pode ser negativo.'),
  body('bathrooms').optional().isInt({ min: 0 }).withMessage('Banheiros não pode ser negativo.'),
  body('area').optional().isFloat({ min: 0 }).withMessage('Área não pode ser negativa.'),
  body('zipCode').optional().matches(/^\d{5}-?\d{3}$/).withMessage('CEP inválido.'),
];

exports.validatePropertyUpdate = [
  body('title').optional().trim().isLength({ min: 10 }).withMessage('Título deve ter no mínimo 10 caracteres.'),
  body('price').optional().isFloat({ min: 1 }).withMessage('Preço deve ser maior que zero.'),
  body('type').optional().isIn(['Casa', 'Apartamento', 'Cobertura', 'Terreno', 'Comercial', 'Galpão']).withMessage('Tipo de imóvel inválido.'),
  body('address').optional().trim().isLength({ min: 5 }).withMessage('Endereço deve ter no mínimo 5 caracteres.'),
  body('city').optional().trim().isLength({ min: 3 }).withMessage('Cidade deve ter no mínimo 3 caracteres.'),
  body('state').optional().trim().matches(/^[A-Z]{2}$/).withMessage('Estado deve ter 2 letras maiúsculas.'),
  body('bedrooms').optional().isInt({ min: 0 }).withMessage('Quartos não pode ser negativo.'),
  body('bathrooms').optional().isInt({ min: 0 }).withMessage('Banheiros não pode ser negativo.'),
  body('area').optional().isFloat({ min: 0 }).withMessage('Área não pode ser negativa.'),
  body('zipCode').optional().matches(/^\d{5}-?\d{3}$/).withMessage('CEP inválido.'),
];

exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
