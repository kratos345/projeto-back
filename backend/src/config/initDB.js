const { sequelize } = require('../config/database');
const User = require('../models/User');
const Property = require('../models/Property');
const PropertyImage = require('../models/PropertyImage');
const Favorite = require('../models/Favorite');
const Lead = require('../models/Lead');
const Visit = require('../models/Visit');
const Notification = require('../models/Notification');
const AdminAudit = require('../models/AdminAudit');
const SellerProfile = require('../models/SellerProfile');
const UserSetting = require('../models/UserSetting');
const seedDB = require('./seedDB');

// Define Associations
const defineAssociations = () => {
  // User Associations
  User.hasMany(Property, { 
    foreignKey: 'sellerId', 
    as: 'properties',
    onDelete: 'CASCADE'
  });
  User.hasMany(Lead, { 
    foreignKey: 'sellerId', 
    as: 'leads',
    onDelete: 'CASCADE'
  });

  // Property Associations
  Property.belongsTo(User, { 
    foreignKey: 'sellerId', 
    as: 'seller',
    onDelete: 'CASCADE'
  });
  Property.hasMany(PropertyImage, { 
    foreignKey: 'propertyId', 
    as: 'images',
    onDelete: 'CASCADE'
  });
  Property.hasMany(Favorite, { 
    foreignKey: 'propertyId',
    onDelete: 'CASCADE'
  });
  Property.hasMany(Lead, { 
    foreignKey: 'propertyId', 
    as: 'leads',
    onDelete: 'CASCADE'
  });
  Property.hasMany(Visit, { 
    foreignKey: 'propertyId', 
    as: 'visits',
    onDelete: 'CASCADE'
  });

  // PropertyImage Associations
  PropertyImage.belongsTo(Property, { 
    foreignKey: 'propertyId',
    onDelete: 'CASCADE'
  });

  // Favorite Associations
  Favorite.belongsTo(User, { 
    foreignKey: 'userId',
    onDelete: 'CASCADE'
  });
  Favorite.belongsTo(Property, { 
    foreignKey: 'propertyId',
    onDelete: 'CASCADE'
  });

  // Lead Associations
  Lead.belongsTo(User, { 
    foreignKey: 'sellerId', 
    as: 'seller',
    onDelete: 'CASCADE'
  });
  Lead.belongsTo(User, { 
    foreignKey: 'buyerId', 
    as: 'buyer',
    onDelete: 'SET NULL'
  });
  Lead.belongsTo(Property, { 
    foreignKey: 'propertyId',
    onDelete: 'CASCADE'
  });
  Lead.hasMany(Visit, { 
    foreignKey: 'leadId',
    onDelete: 'CASCADE'
  });

  // Visit Associations
  Visit.belongsTo(Lead, { 
    foreignKey: 'leadId',
    onDelete: 'CASCADE'
  });
  Visit.belongsTo(User, { 
    foreignKey: 'buyerId', 
    as: 'buyer',
    onDelete: 'CASCADE'
  });
  Visit.belongsTo(User, { 
    foreignKey: 'sellerId', 
    as: 'seller',
    onDelete: 'CASCADE'
  });
  Visit.belongsTo(Property, { 
    foreignKey: 'propertyId',
    onDelete: 'CASCADE'
  });

  // Notification Associations
  User.hasMany(Notification, {
    foreignKey: 'userId',
    as: 'notifications',
    onDelete: 'CASCADE'
  });
  Notification.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE'
  });

  // Seller Profile Associations
  User.hasOne(SellerProfile, {
    foreignKey: 'userId',
    as: 'sellerProfile',
    onDelete: 'CASCADE'
  });
  SellerProfile.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE'
  });

  // User Settings Associations
  User.hasOne(UserSetting, {
    foreignKey: 'userId',
    as: 'settings',
    onDelete: 'CASCADE'
  });
  UserSetting.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE'
  });

  // Admin Audit Associations
  User.hasMany(AdminAudit, {
    foreignKey: 'userId',
    as: 'auditLogs',
    onDelete: 'CASCADE'
  });
  AdminAudit.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE'
  });

};

const initDB = async () => {
  try {
    await sequelize.authenticate();
    defineAssociations();

    try {
      await sequelize.sync({ alter: true });
    } catch (syncError) {
      console.warn('⚠️ Falha no sync alter do SQLite. Forçando recriação do esquema no banco local...');
      await sequelize.sync({ force: true });
    }

    console.log('✅ Banco de dados sincronizado com sucesso!');
    
    // Inserir usuários e dados de teste
    await seedDB();
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco de dados:', error);
    process.exit(1);
  }
};

module.exports = initDB;

