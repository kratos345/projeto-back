const Property = require('../models/Property');
const User = require('../models/User');

// 🟢 LISTAR TODAS as propriedades (com filtros)
exports.getAll = async (req, res, next) => {
  try {
    const { city, type, minPrice, maxPrice, bedrooms, status } = req.query;
    const Op = require('sequelize').Op;

    const typeMap = {
      apartamento: 'Apartamento',
      casa: 'Casa',
      cobertura: 'Cobertura',
      terreno: 'Terreno',
      comercial: 'Comercial',
      galpao: 'Galpão',
      'galpão': 'Galpão'
    };

    const statusMap = {
      approved: 'ativo',
      available: 'disponivel',
      ativo: 'ativo',
      disponivel: 'disponivel',
      pendente: 'pendente'
    };

    const where = {
      status: statusMap[status?.toString().toLowerCase()] || 'ativo'
    };

    if (city) where.city = city;
    if (type) where.type = typeMap[type.toString().toLowerCase()] || type;
    if (minPrice) where.price = { [Op.gte]: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };
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
      where: { sellerId: id }
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
    const sellerId = req.user.id;

    const property = await Property.create({
      title,
      description,
      type,
      price,
      bedrooms,
      bathrooms,
      area,
      street: address,
      number: '',
      complement: '',
      neighborhood: '',
      city,
      state,
      zipCode,
      sellerId,
      status: 'pendente'
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
    if (req.user.role !== 'admin' && property.sellerId !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const updateData = { ...req.body };
    if (req.body.type) updateData.type = req.body.type;
    if (req.body.bedrooms !== undefined) updateData.bedrooms = req.body.bedrooms;
    if (req.body.bathrooms !== undefined) updateData.bathrooms = req.body.bathrooms;
    if (req.body.address !== undefined) updateData.street = req.body.address;

    await property.update(updateData);
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
    if (req.user.role !== 'admin' && property.sellerId !== req.user.id) {
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
