const Favorite = require('../models/Favorite');

// 🟢 ADICIONAR aos favoritos
exports.add = async (req, res, next) => {
  try {
    const { property_id } = req.body;
    const user_id = req.user.id;

    const favorite = await Favorite.create({ user_id, property_id });
    res.status(201).json(favorite);
  } catch (err) {
    next(err);
  }
};

// 🔵 REMOVER dos favoritos
exports.remove = async (req, res, next) => {
  try {
    const { property_id } = req.params;
    const user_id = req.user.id;

    await Favorite.destroy({ where: { user_id, property_id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// 🟣 LISTAR favoritos do usuário
exports.getByUser = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const favorites = await Favorite.findAll({
      where: { user_id },
      include: [{ model: require('../models/Property') }]
    });

    res.json(favorites);
  } catch (err) {
    next(err);
  }
};
