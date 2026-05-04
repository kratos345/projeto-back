const Property = require('../models/Property');
const User = require('../models/User');

// 🟢 LISTAR TODAS as propriedades (com filtros)
exports.getAll = async (req, res, next) => {
  try {
    const { city, type, minPrice, maxPrice, bedrooms } = req.query;

    let where = { status: 'ativo' };
    if (city) where.city = city;
    if (type) where.type = type;
    if (minPrice) where.price = { [require('sequelize').Op.gte]: minPrice };
    if (maxPrice) where.price = { ...where.price, [require('sequelize').Op.lte]: maxPrice };
    if (bedrooms) where.bedrooms = bedrooms;

    const properties = await Property.findAll({
      where,
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });

    res.json(properties);
  } catch (err) {
    next(err);
  }
};

// 🔵 LISTAR imóveis do vendedor
exports.getByVendedor = async (req, res, next) => {
  try {
    const { id } = req.user; // vem do middleware de autenticação

    const properties = await Property.findAll({
      where: { seller_id: id }
    });

    res.json(properties);
  } catch (err) {
    next(err);
  }
};

// 🟣 OBTER um imóvel específico
exports.getById = async (req, res, next) => {
  try {
    const property = await Property.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });

    if (!property) {
      return res.status(404).json({ message: 'Propriedade não encontrada' });
    }

    // Incrementar contador de views
    await property.increment('views');

    res.json(property);
  } catch (err) {
    next(err);
  }
};

// 🟢 CRIAR propriedade (vendedor)
exports.create = async (req, res, next) => {
  try {
    const { title, description, type, price, bedrooms, bathrooms, area, address, city, state, zipCode } = req.body;
    const seller_id = req.user.id;

    const property = await Property.create({
      title,
      description,
      type,
      price,
      bedrooms,
      bathrooms,
      area,
      address,
      city,
      state,
      zipCode,
      seller_id,
      status: 'pendente' // Começa pendente até aprovação do admin
    });

    res.status(201).json(property);
  } catch (err) {
    next(err);
  }
};

// 🟡 ATUALIZAR propriedade
exports.update = async (req, res, next) => {
  try {
    const property = await Property.findByPk(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Propriedade não encontrada' });
    }

    // Verificar se é o dono ou admin
    if (req.user.role !== 'admin' && property.seller_id !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    await property.update(req.body);
    res.json(property);
  } catch (err) {
    next(err);
  }
};

// 🔴 DELETAR propriedade
exports.delete = async (req, res, next) => {
  try {
    const property = await Property.findByPk(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Propriedade não encontrada' });
    }

    // Verificar se é o dono ou admin
    if (req.user.role !== 'admin' && property.seller_id !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    await property.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// 📊 APROVAR propriedade (admin)
exports.approve = async (req, res, next) => {
  try {
    const property = await Property.findByPk(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Propriedade não encontrada' });
    }

    await property.update({ status: 'ativo' });
    res.json({ message: 'Propriedade aprovada', property });
  } catch (err) {
    next(err);
  }
};

// 📊 REJEITAR propriedade (admin)
exports.reject = async (req, res, next) => {
  try {
    const property = await Property.findByPk(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Propriedade não encontrada' });
    }

    await property.destroy();
    res.json({ message: 'Propriedade rejeitada' });
  } catch (err) {
    next(err);
  }
};
