const Favorite = require('../models/Favorite');
const Property = require('../models/Property');

// 🟢 ADICIONAR aos favoritos
exports.add = async (req, res, next) => {
  try {
    const propertyId = parseInt(req.body.propertyId || req.body.property_id, 10);
    const userId = req.user.id;

    if (!propertyId || Number.isNaN(propertyId)) {
      return res.status(400).json({ message: 'propertyId inválido ou ausente.' });
    }

    const property = await Property.findByPk(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Imóvel não encontrado.' });
    }

    const existing = await Favorite.findOne({ where: { userId, propertyId } });
    if (existing) {
      return res.status(200).json(existing);
    }

    const favorite = await Favorite.create({ userId, propertyId });
    res.status(201).json(favorite);
  } catch (err) {
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'Erro ao favoritar: referência de usuário ou imóvel inválida.' });
    }
    next(err);
  }
};

// 🔵 REMOVER dos favoritos
exports.remove = async (req, res, next) => {
  try {
    const propertyId = parseInt(req.params.property_id, 10);
    const userId = req.user.id;

    if (!propertyId || Number.isNaN(propertyId)) {
      return res.status(400).json({ message: 'property_id inválido.' });
    }

    await Favorite.destroy({ where: { userId, propertyId } });
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
