const bcrypt = require('bcryptjs');
const RequestAccount = require('../models/RequestAccount');
const User = require('../models/User');
const { Op } = require('sequelize');

exports.create = async (req, res) => {
  try {
    const { name, cpfCnpj, password, email } = req.body;

    if (!name || !cpfCnpj || !password || !email) {
      return res.status(400).json({ message: 'Campos obrigatórios ausentes' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const reqAcc = await RequestAccount.create({
      name,
      email,
      cpfCnpj,
      password: hashed
    });

    // TODO: notificar admin (email/notification) - futuro

    return res.status(201).json({ message: 'Solicitação recebida', id: reqAcc.id });
  } catch (error) {
    console.error('Erro ao criar solicitação:', error);
    return res.status(500).json({ message: 'Erro ao criar solicitação' });
  }
};

exports.list = async (req, res) => {
  try {
    const items = await RequestAccount.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    return res.json(items);
  } catch (error) {
    console.error('Erro ao listar solicitações:', error);
    return res.status(500).json({ message: 'Erro ao listar solicitações' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status inválido' });
    }

    const item = await RequestAccount.findByPk(id);
    if (!item) return res.status(404).json({ message: 'Solicitação não encontrada' });
    // se aprovar, criar usuário se não existir
    if (status === 'approved') {
      // checar se já existe usuário com email ou cpf
      const existing = await User.findOne({ where: { [Op.or]: [{ email: item.email }, { cpfCnpj: item.cpfCnpj }] } });
      if (!existing) {
        try {
          const newUser = await User.create({
            name: item.name,
            email: item.email,
            password: item.password, // já hash
            cpfCnpj: item.cpfCnpj,
            role: 'user',
            status: 'ativo'
          });
          item.status = 'approved';
          await item.save();
          return res.json({ message: 'Solicitação aprovada e usuário criado', id: item.id, userId: newUser.id });
        } catch (err) {
          console.error('Erro ao criar usuário a partir da solicitação:', err);
          return res.status(500).json({ message: 'Erro ao criar usuário a partir da solicitação' });
        }
      } else {
        // já existe usuário, apenas marcar aprovada
        item.status = 'approved';
        await item.save();
        return res.json({ message: 'Solicitação aprovada (usuário já existente)', id: item.id });
      }
    }

    item.status = status;
    await item.save();

    return res.json({ message: 'Status atualizado', id: item.id, status: item.status });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    return res.status(500).json({ message: 'Erro ao atualizar status' });
  }
};
