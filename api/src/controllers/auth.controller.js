const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'dev_secret_123';
  if (!process.env.JWT_SECRET) {
    console.warn('⚠️ JWT_SECRET não está configurado. Usando secret de desenvolvimento.');
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
    const cpfCnpjValue = cpfCnpj?.trim() ? cpfCnpj.trim() : null;

    // Criar usuário
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: normalizedRole,
      cpfCnpj: cpfCnpjValue,
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
        role: user.role,
        status: user.status
      }
    });

  } catch (error) {
    console.error('❌ Erro no registro:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      const duplicateField = error.errors?.[0]?.path;
      const message = duplicateField === 'email'
        ? 'Este email já está cadastrado. Faça login ou use outro email.'
        : duplicateField === 'cpfCnpj'
          ? 'Este CPF/CNPJ já está cadastrado. Verifique seus dados ou use outro documento.'
          : 'Já existe um usuário com alguns dos dados informados. Verifique e tente novamente.';

      return res.status(400).json({ message });
    }

    return res.status(500).json({ message: 'Erro ao criar usuário. Tente novamente.' });
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
      console.log('⚠️ Tentativa de login com email não registrado:', email);
      // Retornar mensagem genérica para evitar user enumeration
      return res.status(401).json({ message: "Email ou senha incorretos. Verifique seus dados ou faça o cadastro." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log('⚠️ Senha incorreta para:', email);
      // Retornar mensagem genérica para evitar user enumeration
      return res.status(401).json({ message: "Email ou senha incorretos. Verifique seus dados ou faça o cadastro." });
    }

    if (user.status === 'bloqueado') {
      console.log('⚠️ Tentativa de login de usuário bloqueado:', email);
      return res.status(403).json({ message: "Usuário bloqueado. Contate o administrador." });
    }

    if (user.status === 'inativo') {
      console.log('⚠️ Tentativa de login de usuário inativo:', email);
      return res.status(403).json({ message: "Conta inativa. Contate o administrador." });
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
        role: user.role,
        status: user.status
      }
    });

  } catch (error) {
    console.error('❌ Erro no login:', error);
    const message = error.message || "Erro ao fazer login. Tente novamente.";
    return res.status(500).json({ message });
  }
};

// 🟡 ESQUECI/REDEFINIR SENHA (simples, sem token)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email é obrigatório' });

    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log('🔍 Esqueci senha: email não encontrado', email);
      return res.status(404).json({ message: 'Email não encontrado' });
    }

    // Nota: idealmente aqui enviaríamos um e-mail com token.
    // Para atender ao pedido do cliente, apenas confirmamos a existência do e-mail.
    return res.json({ message: 'Email encontrado' });
  } catch (error) {
    console.error('❌ Erro em forgotPassword:', error);
    return res.status(500).json({ message: 'Erro ao processar a solicitação.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email e nova senha são obrigatórios' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Email não encontrado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await user.update({ password: hashedPassword });

    console.log('✅ Senha redefinida para:', email);
    return res.json({ message: 'Senha atualizada com sucesso' });
  } catch (error) {
    console.error('❌ Erro em resetPassword:', error);
    return res.status(500).json({ message: 'Erro ao redefinir a senha.' });
  }
};