const Property = require('../models/Property');
const User = require('../models/User');
const PropertyImage = require('../models/PropertyImage');

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

// 🟢 LISTAR TODAS as propriedades (com filtros)
exports.getAll = async (req, res, next) => {
  try {
    const { city, type, minPrice, maxPrice, bedrooms, status } = req.query;
    const Op = require('sequelize').Op;

    const where = {};
    const statusValue = status?.toString().toLowerCase();

    if (!status) {
      where.status = { [Op.in]: ['ativo', 'disponivel'] };
    } else if (['all', 'todos'].includes(statusValue)) {
      // manter todos os status sem filtro
    } else {
      where.status = statusMap[statusValue] || statusValue;
    }

    if (city) where.city = city;
    if (type) where.type = typeMap[type.toString().toLowerCase()] || type;
    if (minPrice) where.price = { [Op.gte]: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };
    if (bedrooms) where.bedrooms = parseInt(bedrooms, 10);

    const properties = await Property.findAll({
      where,
      include: [
      { model: User, as: 'seller', attributes: ['id', 'name', 'email', 'profileImage'] },
      { model: PropertyImage, as: 'images' }
    ]
    });

    const result = properties.map((property) => {
      const item = property.toJSON();
      const address = [item.street, item.number, item.complement].filter(Boolean).join(', ');
      const location = [item.neighborhood, item.city, item.state].filter(Boolean).join(' • ');
      return {
        ...item,
        image: item.images?.find((img) => img?.isFeatured)?.url || item.images?.[0]?.url || null,
        address,
        location
      };
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

// 🔵 LISTAR imóveis do vendedor
exports.getByVendedor = async (req, res, next) => {
  try {
    const { id } = req.user; // vem do middleware de autenticação

    const properties = await Property.findAll({
      where: { sellerId: id },
      include: [{ model: PropertyImage, as: 'images' }]
    });

    const result = properties.map((property) => {
      const item = property.toJSON();
      const address = [item.street, item.number, item.complement].filter(Boolean).join(', ');
      const location = [item.neighborhood, item.city, item.state].filter(Boolean).join(' • ');
      return {
        ...item,
        image: item.images?.find((img) => img?.isFeatured)?.url || item.images?.[0]?.url || null,
        address,
        location
      };
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

// 🟣 OBTER um imóvel específico
exports.getById = async (req, res, next) => {
  try {
    const property = await Property.findByPk(req.params.id, {
      include: [
        { model: User, as: 'seller', attributes: ['id', 'name', 'email'] },
        { model: PropertyImage, as: 'images' }
      ]
    });

    if (!property) {
      return res.status(404).json({ message: 'Propriedade não encontrada' });
    }

    // Incrementar contador de views
    await property.increment('views');

    const item = property.toJSON();
    const address = [item.street, item.number, item.complement].filter(Boolean).join(', ');
    const location = [item.neighborhood, item.city, item.state].filter(Boolean).join(' • ');

    res.json({
      ...item,
      image: item.images?.find((img) => img.isFeatured)?.url || item.images?.[0]?.url || null,
      address,
      location
    });
  } catch (err) {
    next(err);
  }
};

// 🟢 CRIAR propriedade (vendedor)
exports.create = async (req, res, next) => {
  try {
    const { title, description, type, price, bedrooms, bathrooms, area, address, city, state, zipCode } = req.body;
    const sellerId = req.user.id;

    const normalizedType = typeMap[type?.toString().toLowerCase()] || type;
    const allowedTypes = ['Casa', 'Apartamento', 'Cobertura', 'Terreno', 'Comercial', 'Galpão'];

    // Validações rigorosas
    if (!title || title.trim().length < 10) {
      return res.status(400).json({ message: 'Título deve ter no mínimo 10 caracteres' });
    }

    if (!price || Number(price) <= 0) {
      return res.status(400).json({ message: 'Preço deve ser maior que zero' });
    }

    if (!allowedTypes.includes(normalizedType)) {
      return res.status(400).json({ message: 'Tipo de imóvel inválido' });
    }

    if (!address || address.trim().length < 5) {
      return res.status(400).json({ message: 'Endereço deve ter no mínimo 5 caracteres' });
    }

    if (!city || city.trim().length < 3) {
      return res.status(400).json({ message: 'Cidade inválida' });
    }

    if (!state || state.trim().length !== 2) {
      return res.status(400).json({ message: 'Estado deve ter 2 caracteres' });
    }

    if (bedrooms < 0 || bathrooms < 0 || area < 0) {
      return res.status(400).json({ message: 'Valores não podem ser negativos' });
    }

    const property = await Property.create({
      title: title.trim(),
      description: description?.trim() || '',
      type: normalizedType,
      price: Number(price),
      bedrooms: bedrooms || 0,
      bathrooms: bathrooms || 0,
      area: area || 0,
      street: address.trim(),
      number: '',
      complement: '',
      neighborhood: '',
      city: city.trim(),
      state: state.trim().toUpperCase(),
      zipCode: zipCode?.trim() || '',
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

    const updateData = {};
    const allowedFields = ['title', 'description', 'type', 'price', 'bedrooms', 'bathrooms', 'area', 'street', 'number', 'complement', 'neighborhood', 'city', 'state', 'zipCode', 'featured'];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (req.body.address !== undefined) {
      updateData.street = req.body.address;
    }

    if (req.body.state) {
      updateData.state = req.body.state.trim().toUpperCase();
    }

    if (req.user.role !== 'admin') {
      delete updateData.status;
    } else if (req.body.status) {
      const allowedStatuses = ['disponivel', 'negociando', 'vendido', 'arquivado', 'pendente', 'ativo'];
      const normalizedStatus = statusMap[req.body.status?.toString().toLowerCase()] || req.body.status.toString().toLowerCase();
      if (!allowedStatuses.includes(normalizedStatus)) {
        return res.status(400).json({ message: 'Status inválido para atualização.' });
      }
      updateData.status = normalizedStatus;
    }

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

exports.uploadPropertyImages = async (req, res, next) => {
  try {
    const property = await Property.findByPk(req.params.id);
    if (!property) return res.status(404).json({ message: 'Propriedade não encontrada' });

    if (req.user.role !== 'admin' && property.sellerId !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Nenhuma imagem enviada.' });
    }

    const images = await Promise.all(req.files.map((file, index) => {
      const url = `${req.protocol}://${req.get('host')}/uploads/properties/${file.filename}`;
      return PropertyImage.create({
        propertyId: property.id,
        url,
        order: index,
        isFeatured: index === 0
      });
    }));

    res.status(201).json(images);
  } catch (err) {
    next(err);
  }
};

exports.deletePropertyImage = async (req, res, next) => {
  try {
    const image = await PropertyImage.findByPk(req.params.imageId);
    if (!image || image.propertyId.toString() !== req.params.id) {
      return res.status(404).json({ message: 'Imagem não encontrada.' });
    }

    const property = await Property.findByPk(image.propertyId);
    if (!property) return res.status(404).json({ message: 'Propriedade não encontrada.' });

    if (req.user.role !== 'admin' && property.sellerId !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    await image.destroy();
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
