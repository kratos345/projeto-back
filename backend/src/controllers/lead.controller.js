const Lead = require('../models/Lead');
const Property = require('../models/Property');

// 🟢 CRIAR novo lead
exports.create = async (req, res, next) => {
  try {
    const { propertyId, name, email, phone } = req.body;
    if (!propertyId) {
      return res.status(400).json({ message: 'propertyId é obrigatório.' });
    }

    const property = await Property.findByPk(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Propriedade não encontrada.' });
    }

    const lead = await Lead.create({
      propertyId,
      sellerId: property.sellerId,
      buyerId: req.user?.id || null,
      name: name?.trim() || null,
      email: email?.trim() || null,
      phone: phone?.trim() || null,
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
          attributes: ['id', 'title', 'street', 'city', 'state']
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
    const property = await Property.findByPk(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Propriedade não encontrada.' });
    }

    if (req.user.role !== 'admin' && property.sellerId !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

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

    // Validar status permitidos
    const validStatuses = ['novo', 'contatado', 'visita_agendada', 'proposta_enviada', 'negociando', 'fechado', 'perdido'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status inválido. Use um de: ${validStatuses.join(', ')}` });
    }

    await lead.update({ status, notes: notes || lead.notes, updatedAt: new Date() });
    res.json(lead);
  } catch (err) {
    next(err);
  }
};

// 🔴 FECHAR lead (marcar como fechado)
exports.closeLead = async (req, res, next) => {
  try {
    const { reason } = req.body; // 'fechado' ou 'perdido'
    const lead = await Lead.findByPk(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead não encontrado' });
    }

    const validReasons = ['fechado', 'perdido'];
    if (!validReasons.includes(reason)) {
      return res.status(400).json({ message: 'Motivo inválido: use "fechado" ou "perdido"' });
    }

    await lead.update({ 
      status: reason, 
      updatedAt: new Date()
    });

    res.json({ 
      message: `Lead marcado como ${reason}`, 
      lead 
    });
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
