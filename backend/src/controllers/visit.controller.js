const Visit = require('../models/Visit');
const Lead = require('../models/Lead');

// 🟢 AGENDAR visita
exports.create = async (req, res, next) => {
  try {
    const { propertyId, leadId, scheduledDate, notes } = req.body;

    const visit = await Visit.create({
      propertyId,
      leadId,
      scheduledDate,
      notes,
      status: 'agendada'
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
