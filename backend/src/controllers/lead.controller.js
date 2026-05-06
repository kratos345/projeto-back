const Lead = require('../models/Lead');
const Property = require('../models/Property');

// 🟢 CRIAR novo lead
exports.create = async (req, res, next) => {
  try {
    const { propertyId, name, email, phone } = req.body;
    const buyerId = req.user?.id || null;

    // Validar propriedade
    const property = await Property.findByPk(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Propriedade não encontrada' });
    }

    const lead = await Lead.create({
      propertyId,
      buyerId,
      name,
      email,
      phone,
      status: 'novo'
    });

    res.status(201).json(lead);
  } catch (err) {
    next(err);
  }
};

// 🔵 LISTAR leads de um vendedor
exports.getByVendedor = async (req, res, next) => {
  try {
    const { id } = req.user;

    const leads = await Lead.findAll({
      include: [
        {
          model: Property,
          where: { sellerId: id },
          attributes: ['id', 'title', 'address']
        }
      ]
    });

    res.json(leads);
  } catch (err) {
    next(err);
  }
};

// 🟣 OBTER leads de uma propriedade específica
exports.getByProperty = async (req, res, next) => {
  try {
    const leads = await Lead.findAll({
      where: { propertyId: req.params.id }
    });

    res.json(leads);
  } catch (err) {
    next(err);
  }
};

// 🟡 ATUALIZAR status do lead
exports.updateStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const lead = await Lead.findByPk(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead não encontrado' });
    }

    await lead.update({ status, notes: notes || lead.notes });
    res.json(lead);
  } catch (err) {
    next(err);
  }
};

// 📊 METRICS - Contar leads por status (para vendedor)
exports.getMetrics = async (req, res, next) => {
  try {
    const { id } = req.user;

    const metrics = await Lead.findAll({
      attributes: [
        'status',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      include: [
        {
          model: Property,
          where: { sellerId: id },
          attributes: []
        }
      ],
      group: ['status'],
      raw: true
    });

    res.json(metrics);
  } catch (err) {
    next(err);
  }
};
