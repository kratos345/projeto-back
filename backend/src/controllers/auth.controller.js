const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET não está configurado no servidor.');
  }

  return jwt.sign(
    { id: user.id, role: user.role },
    secret,
    { expiresIn: process.env.JWT_EXPIRES || '7d' }
  );
};

// 🟢 REGISTRO
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('❌ Erros de validação:', errors.array());
    return res.status(400).json({ 
      message: "Dados inválidos: " + errors.array().map(e => e.msg).join(', ') 
    });
  }

  try {
    const { name, email, password, role, cpfCnpj } = req.body;

    // Validação de campos obrigatórios
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nome, email e senha são obrigatórios" });
    }

    const roleMap = {
      user: 'user',
      usuario: 'user',
      vendedor: 'vendedor',
      admin: 'admin',
      adm: 'admin'
    };
    const normalizedRole = role && roleMap[role.toLowerCase()] ? roleMap[role.toLowerCase()] : 'user';

    // Verificar se email já existe
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      console.log('⚠️ Email já registrado:', email);
      return res.status(400).json({ message: "Este email já está cadastrado. Faça login ou use outro email." });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: normalizedRole,
      cpfCnpj: cpfCnpj || null,
    });

    console.log('✅ Usuário criado com sucesso:', user.email);

    const token = generateToken(user);

    return res.status(201).json({
      message: "Usuário criado com sucesso",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Erro no registro:', error);
    
    // Erro de chave duplicada
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: "Email já cadastrado. Tente fazer login." });
    }
    
    return res.status(500).json({ message: "Erro ao criar usuário. Tente novamente." });
  }
};

// 🔵 LOGIN
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('❌ Erros de validação no login:', errors.array());
    return res.status(400).json({ 
      message: "Email e senha são obrigatórios" 
    });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log('⚠️ Usuário não encontrado:', email);
      return res.status(404).json({ message: "Usuário não encontrado. Faça o cadastro primeiro." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log('⚠️ Senha incorreta para:', email);
      return res.status(401).json({ message: "Senha incorreta" });
    }

    console.log('✅ Login realizado:', email);
    const token = generateToken(user);

    return res.json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Erro no login:', error);
    return res.status(500).json({ message: "Erro ao fazer login. Tente novamente." });
  }
};