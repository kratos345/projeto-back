const Visit = require('../models/Visit');
const Lead = require('../models/Lead');

// 🟢 AGENDAR visita
exports.create = async (req, res, next) => {
  try {
    const { propertyId, leadId, scheduledDate, notes, buyerId: bodyBuyerId } = req.body;

    if (!propertyId || !leadId || !scheduledDate) {
      return res.status(400).json({ message: 'propertyId, leadId e scheduledDate são obrigatórios.' });
    }

    const property = await require('../models/Property').findByPk(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Propriedade não encontrada.' });
    }

    const lead = await Lead.findByPk(leadId);
    if (!lead) {
      return res.status(404).json({ message: 'Lead não encontrado.' });
    }

    if (lead.propertyId && lead.propertyId !== property.id) {
      return res.status(400).json({ message: 'Lead não pertence a essa propriedade.' });
    }

    const allowedStatuses = ['agendada', 'realizada', 'cancelada', 'nao_compareceu'];
    const status = req.body.status || 'agendada';

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: `Status inválido. Use um de: ${allowedStatuses.join(', ')}` });
    }

    const buyerId = bodyBuyerId || lead.buyerId || req.user.id;
    const sellerId = property.sellerId;

    const visit = await Visit.create({
      propertyId,
      leadId,
      buyerId,
      sellerId,
      scheduledDate,
      notes: notes?.trim() || null,
      status
    });

    res.status(201).json(visit);
  } catch (err) {
    next(err);
  }
};

// 🔵 LISTAR visitas de um lead
exports.getByLead = async (req, res, next) => {
  try {
    const visits = await Visit.findAll({
      where: { leadId: req.params.id }
    });

    res.json(visits);
  } catch (err) {
    next(err);
  }
};

// 🟡 ATUALIZAR status da visita
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const visit = await Visit.findByPk(req.params.id);

    if (!visit) {
      return res.status(404).json({ message: 'Visita não encontrada' });
    }

    await visit.update({ status });
    res.json(visit);
  } catch (err) {
    next(err);
  }
};
