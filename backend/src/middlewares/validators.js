const { body, validationResult } = require('express-validator');

// Validar CPF
function isValidCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  const digit1 = 11 - (sum % 11);
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  const digit2 = 11 - (sum % 11);
  return parseInt(cpf[9]) === (digit1 > 9 ? 0 : digit1) && parseInt(cpf[10]) === (digit2 > 9 ? 0 : digit2);
}

// Validar CNPJ
function isValidCNPJ(cnpj) {
  cnpj = cnpj.replace(/\D/g, '');
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;
  let sum = 0;
  const multipliers = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  for (let i = 0; i < 12; i++) sum += parseInt(cnpj[i]) * multipliers[i];
  const digit1 = 11 - (sum % 11);
  sum = 0;
  const multipliers2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  for (let i = 0; i < 13; i++) sum += parseInt(cnpj[i]) * multipliers2[i];
  const digit2 = 11 - (sum % 11);
  return parseInt(cnpj[12]) === (digit1 > 9 ? 0 : digit1) && parseInt(cnpj[13]) === (digit2 > 9 ? 0 : digit2);
}

exports.validateRegister = [
  body('name').trim().notEmpty().withMessage('Nome é obrigatório.'),
  body('email').isEmail().withMessage('E-mail inválido.').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Senha deve ter pelo menos 8 caracteres.')
    .matches(/[A-Z]/)
    .withMessage('Senha deve conter pelo menos uma letra maiúscula.')
    .matches(/[a-z]/)
    .withMessage('Senha deve conter pelo menos uma letra minúscula.')
    .matches(/[0-9]/)
    .withMessage('Senha deve conter pelo menos um número.')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Senha deve conter pelo menos um caractere especial.'),
  body('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('As senhas não coincidem.'),
  body('cpfCnpj')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .custom(value => {
      if (!value) return true;
      if (isValidCPF(value) || isValidCNPJ(value)) return true;
      throw new Error('CPF ou CNPJ inválido.');
    }),
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
  body('status').optional().isIn(['disponivel', 'negociando', 'vendido', 'arquivado', 'pendente', 'ativo']).withMessage('Status de imóvel inválido.'),
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
  body('status').optional().isIn(['disponivel', 'negociando', 'vendido', 'arquivado', 'pendente', 'ativo']).withMessage('Status de imóvel inválido.'),
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
