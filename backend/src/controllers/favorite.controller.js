const Favorite = require('../models/Favorite');

// 🟢 ADICIONAR aos favoritos
exports.add = async (req, res, next) => {
  try {
    const { propertyId } = req.body;
    const userId = req.user.id;

    if (!propertyId) {
      return res.status(400).json({ message: 'propertyId é obrigatório.' });
    }

    const existing = await Favorite.findOne({ where: { userId, propertyId } });
    if (existing) {
      return res.status(200).json(existing);
    }

    const favorite = await Favorite.create({ userId, propertyId });
    res.status(201).json(favorite);
  } catch (err) {
    next(err);
  }
};

// 🔵 REMOVER dos favoritos
exports.remove = async (req, res, next) => {
  try {
    const { property_id } = req.params;
    const userId = req.user.id;

    await Favorite.destroy({ where: { userId, propertyId: property_id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// 🟣 LISTAR favoritos do usuário
exports.getByUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const favorites = await Favorite.findAll({
      where: { userId },
      include: [{ model: require('../models/Property') }]
    });

    res.json(favorites);
  } catch (err) {
    next(err);
  }
};
