const Property = require('../models/Property');
const Lead = require('../models/Lead');
const User = require('../models/User');
const { sequelize } = require('../config/database');

// 📊 DASHBOARD ADMIN - Métricas Gerais
exports.adminMetrics = async (req, res, next) => {
  try {
    // Total de imóveis
    const totalProperties = await Property.count();
    const activeProperties = await Property.count({ where: { status: 'ativo' } });
    const soldProperties = await Property.count({ where: { status: 'vendido' } });
    const pendingProperties = await Property.count({ where: { status: 'pendente' } });

    // Total de vendedores e usuários
    const totalSellers = await User.count({ where: { role: 'vendedor' } });
    const totalUsers = await User.count({ where: { role: 'user' } });
    const totalAdmins = await User.count({ where: { role: 'admin' } });

    // Total de leads
    const totalLeads = await Lead.count();
    const newLeads = await Lead.count({ where: { status: 'novo' } });
    const closedLeads = await Lead.count({ where: { status: 'fechado' } });

    // Imóveis mais visualizados
    const topProperties = await Property.findAll({
      order: [['views', 'DESC']],
      limit: 5,
      attributes: ['id', 'title', 'views', 'price']
    });

    // Vendedores top
    const topSellers = await User.findAll({
      where: { role: 'vendedor' },
      attributes: {
        include: [
          [
            sequelize.fn('COUNT', sequelize.col('Properties.id')),
            'totalProperties'
          ]
        ]
      },
      include: [
        {
          model: Property,
          attributes: [],
          required: false
        }
      ],
      group: ['User.id'],
      order: [[sequelize.fn('COUNT', sequelize.col('Properties.id')), 'DESC']],
      limit: 5,
      subQuery: false,
      raw: true
    });

    res.json({
      properties: {
        total: totalProperties,
        active: activeProperties,
        sold: soldProperties,
        pending: pendingProperties
      },
      users: {
        sellers: totalSellers,
        buyers: totalUsers,
        admins: totalAdmins
      },
      leads: {
        total: totalLeads,
        new: newLeads,
        closed: closedLeads
      },
      topProperties,
      topSellers
    });
  } catch (err) {
    next(err);
  }
};

// 📊 DASHBOARD VENDEDOR - Métricas Pessoais
exports.sellerMetrics = async (req, res, next) => {
  try {
    const { id } = req.user;

    // Propriedades do vendedor
    const totalProperties = await Property.count({ where: { sellerId: id } });
    const activeProperties = await Property.count({ where: { sellerId: id, status: 'ativo' } });
    const soldProperties = await Property.count({ where: { sellerId: id, status: 'vendido' } });

    // Leads relacionados
    const totalLeads = await Lead.count({
      include: [{ model: Property, where: { sellerId: id }, attributes: [] }]
    });

    const leadsPerStatus = await Lead.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      include: [{ model: Property, where: { sellerId: id }, attributes: [] }],
      group: ['status'],
      raw: true
    });

    // Total de visualizações
    const totalViews = await Property.findAll({
      where: { sellerId: id },
      attributes: [[sequelize.fn('SUM', sequelize.col('views')), 'total']]
    });

    res.json({
      properties: {
        total: totalProperties,
        active: activeProperties,
        sold: soldProperties
      },
      leads: {
        total: totalLeads,
        perStatus: leadsPerStatus
      },
      stats: {
        totalViews: totalViews[0]?.dataValues?.total || 0
      }
    });
  } catch (err) {
    next(err);
  }
};
