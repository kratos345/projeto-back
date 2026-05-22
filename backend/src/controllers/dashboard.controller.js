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

    // Vendas e faturamento
    const totalRevenue = await Property.sum('price', { where: { status: 'vendido' } }) || 0;
    const totalSoldProperties = await Property.count({ where: { status: 'vendido' } });

    const salesByCity = await Property.findAll({
      where: { status: 'vendido' },
      attributes: [
        'city',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('price')), 'revenue']
      ],
      group: ['city'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      raw: true
    });

    const topProperties = await Property.findAll({
      where: { status: 'vendido' },
      order: [['updatedAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'title', 'views', 'price', 'city', 'state', 'sellerId'],
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name']
        }
      ]
    });

    const topSellers = await User.findAll({
      where: { role: 'vendedor' },
      attributes: [
        'id',
        'name',
        'email',
        [sequelize.literal(`(SELECT SUM(price) FROM Properties WHERE sellerId = User.id AND status = 'vendido')`), 'revenue'],
        [sequelize.literal(`(SELECT COUNT(id) FROM Properties WHERE sellerId = User.id AND status = 'vendido')`), 'soldProperties']
      ],
      order: [[sequelize.literal('revenue'), 'DESC']],
      limit: 5,
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
      sales: {
        totalRevenue: Number(totalRevenue),
        totalSoldProperties,
        salesByCity,
        topSellers,
        recentSales: topProperties
      }
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

    // Leads relacionados diretamente pelo sellerId do lead
    const totalLeads = await Lead.count({ where: { sellerId: id } });

    const leadsPerStatus = await Lead.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('status')), 'count']
      ],
      where: { sellerId: id },
      group: ['status'],
      raw: true
    });

    // Total de visualizações do vendedor
    const totalViews = await Property.sum('views', { where: { sellerId: id } });

    const soldPropertiesList = await Property.findAll({
      where: { sellerId: id, status: 'vendido' },
      attributes: ['id', 'title', 'price', 'city', 'state', 'updatedAt'],
      order: [['updatedAt', 'DESC']],
      limit: 5
    });

    const revenue = await Property.sum('price', { where: { sellerId: id, status: 'vendido' } }) || 0;
    const averageSalePrice = soldProperties > 0 ? Number(revenue) / soldProperties : 0;

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
        totalViews: totalViews || 0,
        revenue: Number(revenue),
        averageSalePrice: Number(averageSalePrice.toFixed(2)),
        recentSales: soldPropertiesList
      }
    });
  } catch (err) {
    next(err);
  }
};
