const User = require('../models/User');
const safe = (u) => { const { password, ...rest } = u.toJSON(); return rest; };

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
    await user.update(req.body);
    res.json(safe(user));
  } catch (err) { next(err); }
};
exports.remove = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario nao encontrado.' });
    await user.destroy();
    res.status(204).send();
  } catch (err) { next(err); }
};
