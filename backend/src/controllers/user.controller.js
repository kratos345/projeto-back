const bcrypt = require('bcryptjs');
const User = require('../models/User');
const safe = (u) => { const { password, ...rest } = u.toJSON(); return rest; };

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuario nao encontrado.' });
    res.json(safe(user));
  } catch (err) {
    next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuario nao encontrado.' });

    const updateData = { ...req.body };

    if (req.user.role !== 'admin') {
      delete updateData.role;
      delete updateData.status;
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    await user.update(updateData);
    res.json(safe(user));
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Dados duplicados. Verifique os campos e tente novamente.' });
    }
    next(err);
  }
};

exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuario nao encontrado.' });

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/users/${req.file.filename}`;
    await user.update({ profileImage: fileUrl });

    res.json(safe(user));
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try { res.json((await User.findAll()).map(safe)); } catch (err) { next(err); }
};
exports.getById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario nao encontrado.' });
    res.json(safe(user));
  } catch (err) { next(err); }
};
exports.update = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario nao encontrado.' });

    if (req.user.role !== 'admin' && req.user.id !== user.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const updateData = { ...req.body };
    if (req.user.role !== 'admin') {
      delete updateData.role;
      delete updateData.status;
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    await user.update(updateData);
    res.json(safe(user));
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Dados duplicados. Verifique os campos e tente novamente.' });
    }
    next(err);
  }
};
exports.remove = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario nao encontrado.' });
    await user.destroy();
    res.status(204).send();
  } catch (err) { next(err); }
};
