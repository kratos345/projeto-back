const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const User = require('../models/User');
const Property = require('../models/Property');
const PropertyImage = require('../models/PropertyImage');
const Lead = require('../models/Lead');
const SellerProfile = require('../models/SellerProfile');
const UserSetting = require('../models/UserSetting');
const safe = (u) => { const { password, ...rest } = u.toJSON(); return rest; };

exports.getMe = async (req, res, next) => {
  try {
    const userId = Number(req.user?.id);
    if (!userId || Number.isNaN(userId)) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'Usuario nao encontrado.' });
    res.json(safe(user));
  } catch (err) {
    next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    const userId = Number(req.user?.id);
    if (!userId || Number.isNaN(userId)) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'Usuario nao encontrado.' });

    const updateData = { ...req.body };

    if (req.user.role !== 'admin') {
      delete updateData.role;
      delete updateData.status;
    }

    if (updateData.cpfCnpj !== undefined) {
      updateData.cpfCnpj = updateData.cpfCnpj?.trim() || null;
    }
    if (updateData.company !== undefined) {
      updateData.company = updateData.company?.trim() || null;
    }
    if (updateData.creci !== undefined) {
      updateData.creci = updateData.creci?.trim() || null;
    }
    if (updateData.website !== undefined) {
      updateData.website = updateData.website?.trim() || null;
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    await user.update(updateData);
    res.json(safe(user));
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Dados duplicados. Verifique os campos e tente novamente.' });
    }
    next(err);
  }
};

const getOrCreateUserSetting = async (userId) => {
  let settings = await UserSetting.findOne({ where: { userId } });
  if (!settings) {
    settings = await UserSetting.create({
      userId,
      preferences: {
        darkMode: false,
        receiveEmails: true,
        receiveSMS: false,
        publicProfile: false,
        autoApproveLeads: false,
        weeklySummary: true,
        propertyRecommendations: true
      },
      notificationsEnabled: true,
      language: 'pt-BR'
    });
  }
  return settings;
};

exports.getSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateUserSetting(req.user.id);
    res.json(settings);
  } catch (err) {
    next(err);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateUserSetting(req.user.id);
    const { preferences = {}, notificationsEnabled } = req.body;

    await settings.update({
      preferences: {
        ...settings.preferences,
        ...preferences
      },
      notificationsEnabled: typeof notificationsEnabled === 'boolean' ? notificationsEnabled : settings.notificationsEnabled
    });

    res.json(settings);
  } catch (err) {
    next(err);
  }
};

exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }

    const userId = Number(req.user?.id);
    if (!userId || Number.isNaN(userId)) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'Usuario nao encontrado.' });

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/users/${req.file.filename}`;
    await user.update({ profileImage: fileUrl });

    res.json(safe(user));
  } catch (err) {
    next(err);
  }
};

exports.getMyPurchases = async (req, res, next) => {
  try {
    const purchases = await Lead.findAll({
      where: { buyerId: req.user.id, status: 'fechado' },
      include: [
        {
          model: Property,
          include: [{ model: PropertyImage, as: 'images' }],
          attributes: ['id', 'title', 'price', 'city', 'state', 'status']
        },
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['updatedAt', 'DESC']]
    });

    const result = purchases.map((purchase) => {
      const purchaseData = purchase.toJSON();
      const property = purchaseData.Property || {};
      return {
        ...purchaseData,
        Property: {
          ...property,
          image: property.images?.[0]?.url || null
        }
      };
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getSellers = async (req, res, next) => {
  try {
    const sellers = await User.findAll({
      where: { role: 'vendedor' },
      attributes: ['id', 'name', 'email', 'company', 'creci', 'website', 'profileImage', 'status', 'createdAt'],
      include: [
        {
          model: SellerProfile,
          as: 'sellerProfile',
          attributes: ['rating', 'totalSales', 'commissionRate', 'bio']
        }
      ]
    });

    const sellerStats = await Property.findAll({
      where: { status: 'vendido' },
      attributes: [
        'sellerId',
        [sequelize.fn('COUNT', sequelize.col('id')), 'salesCount'],
        [sequelize.fn('SUM', sequelize.col('price')), 'totalRevenue']
      ],
      group: ['sellerId'],
      raw: true
    });

    const salesMap = Object.fromEntries(sellerStats.map((item) => [item.sellerId, {
      salesCount: Number(item.salesCount || 0),
      totalRevenue: Number(item.totalRevenue || 0)
    }]));

    const data = sellers.map((seller) => ({
      id: seller.id,
      name: seller.name,
      email: seller.email,
      company: seller.company,
      creci: seller.creci,
      website: seller.website,
      profileImage: seller.profileImage,
      status: seller.status,
      createdAt: seller.createdAt,
      profile: seller.sellerProfile ? {
        rating: seller.sellerProfile.rating,
        totalSales: seller.sellerProfile.totalSales,
        commissionRate: seller.sellerProfile.commissionRate,
        bio: seller.sellerProfile.bio
      } : null,
      salesCount: salesMap[seller.id]?.salesCount || 0,
      totalRevenue: salesMap[seller.id]?.totalRevenue || 0
    }));

    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getSellerSales = async (req, res, next) => {
  try {
    const sellerId = Number(req.params.id);
    if (Number.isNaN(sellerId)) {
      return res.status(400).json({ message: 'ID de vendedor inválido.' });
    }

    const seller = await User.findOne({
      where: { id: sellerId, role: 'vendedor' },
      attributes: ['id', 'name', 'email', 'company', 'creci', 'website', 'profileImage', 'status', 'createdAt'],
      include: [
        {
          model: SellerProfile,
          as: 'sellerProfile',
          attributes: ['rating', 'totalSales', 'commissionRate', 'bio']
        }
      ]
    });

    if (!seller) {
      return res.status(404).json({ message: 'Vendedor não encontrado.' });
    }

    const soldProperties = await Property.findAll({
      where: { sellerId, status: 'vendido' },
      attributes: ['id', 'title', 'price', 'city', 'state', 'status', 'updatedAt']
    });

    const closedLeads = await Lead.findAll({
      where: { sellerId, status: 'fechado' },
      attributes: ['id', 'propertyId', 'buyerId', 'name', 'email', 'phone', 'status', 'updatedAt'],
      order: [['updatedAt', 'DESC']],
      limit: 20
    });

    const totalRevenue = soldProperties.reduce((sum, property) => sum + Number(property.price || 0), 0);
    const salesCount = soldProperties.length;
    const averageSale = salesCount > 0 ? totalRevenue / salesCount : 0;

    res.json({
      seller: {
        id: seller.id,
        name: seller.name,
        email: seller.email,
        company: seller.company,
        creci: seller.creci,
        website: seller.website,
        profileImage: seller.profileImage,
        status: seller.status,
        createdAt: seller.createdAt,
        profile: seller.sellerProfile ? {
          rating: seller.sellerProfile.rating,
          totalSales: seller.sellerProfile.totalSales,
          commissionRate: seller.sellerProfile.commissionRate,
          bio: seller.sellerProfile.bio
        } : null
      },
      stats: {
        salesCount,
        totalRevenue,
        averageSale
      },
      soldProperties,
      closedLeads
    });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try { res.json((await User.findAll()).map(safe)); } catch (err) { next(err); }
};
exports.getById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario nao encontrado.' });
    res.json(safe(user));
  } catch (err) { next(err); }
};
exports.update = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario nao encontrado.' });

    if (req.user.role !== 'admin' && req.user.id !== user.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const updateData = { ...req.body };
    if (req.user.role !== 'admin') {
      delete updateData.role;
      delete updateData.status;
    }

    if (updateData.cpfCnpj !== undefined) {
      updateData.cpfCnpj = updateData.cpfCnpj?.trim() || null;
    }
    if (updateData.company !== undefined) {
      updateData.company = updateData.company?.trim() || null;
    }
    if (updateData.creci !== undefined) {
      updateData.creci = updateData.creci?.trim() || null;
    }
    if (updateData.website !== undefined) {
      updateData.website = updateData.website?.trim() || null;
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    await user.update(updateData);
    res.json(safe(user));
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Dados duplicados. Verifique os campos e tente novamente.' });
    }
    next(err);
  }
};
exports.remove = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario nao encontrado.' });
    if (req.user.id === user.id) {
      return res.status(400).json({ message: 'Você não pode remover seu próprio usuário.' });
    }
    await user.destroy();
    res.status(204).send();
  } catch (err) { next(err); }
};
