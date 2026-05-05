const { sequelize } = require('../config/database');
const User = require('../models/User');
const Property = require('../models/Property');
const Vehicle = require('../models/Vehicle');
const PropertyImage = require('../models/PropertyImage');
const VehicleImage = require('../models/VehicleImage');
const Favorite = require('../models/Favorite');
const Lead = require('../models/Lead');
const Visit = require('../models/Visit');
const Message = require('../models/Message');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const Transaction = require('../models/Transaction');
const seedDB = require('./seedDB');

// Define Associations
const defineAssociations = () => {
  // User Associations
  User.hasMany(Property, { foreignKey: 'sellerId', as: 'properties' });
  User.hasMany(Vehicle, { foreignKey: 'sellerId', as: 'vehicles' });
  User.hasMany(Lead, { foreignKey: 'sellerId', as: 'leads' });
  User.hasMany(Review, { foreignKey: 'sellerId', as: 'reviews' });
  User.hasMany(Transaction, { foreignKey: 'sellerId', as: 'transactionsSold' });
  User.hasMany(Transaction, { foreignKey: 'buyerId', as: 'transactionsBought' });

  // Property Associations
  Property.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });
  Property.hasMany(PropertyImage, { foreignKey: 'propertyId', as: 'images' });
  Property.hasMany(Favorite, { foreignKey: 'propertyId' });
  Property.hasMany(Lead, { foreignKey: 'propertyId', as: 'leads' });
  Property.hasMany(Visit, { foreignKey: 'propertyId', as: 'visits' });
  Property.hasMany(Message, { foreignKey: 'propertyId' });
  Property.hasMany(Review, { foreignKey: 'propertyId' });
  Property.hasMany(Transaction, { foreignKey: 'propertyId' });

  // Vehicle Associations
  Vehicle.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });
  Vehicle.hasMany(VehicleImage, { foreignKey: 'vehicleId', as: 'images' });
  Vehicle.hasMany(Favorite, { foreignKey: 'vehicleId' });
  Vehicle.hasMany(Lead, { foreignKey: 'vehicleId', as: 'leads' });
  Vehicle.hasMany(Visit, { foreignKey: 'vehicleId', as: 'visits' });
  Vehicle.hasMany(Message, { foreignKey: 'vehicleId' });
  Vehicle.hasMany(Review, { foreignKey: 'vehicleId' });
  Vehicle.hasMany(Transaction, { foreignKey: 'vehicleId' });

  // PropertyImage Associations
  PropertyImage.belongsTo(Property, { foreignKey: 'propertyId' });

  // VehicleImage Associations
  VehicleImage.belongsTo(Vehicle, { foreignKey: 'vehicleId' });

  // Favorite Associations
  Favorite.belongsTo(User, { foreignKey: 'userId' });
  Favorite.belongsTo(Property, { foreignKey: 'propertyId' });
  Favorite.belongsTo(Vehicle, { foreignKey: 'vehicleId' });

  // Lead Associations
  Lead.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });
  Lead.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });
  Lead.belongsTo(Property, { foreignKey: 'propertyId' });
  Lead.belongsTo(Vehicle, { foreignKey: 'vehicleId' });
  Lead.hasMany(Visit, { foreignKey: 'leadId' });
  Lead.hasMany(Message, { foreignKey: 'leadId' });

  // Visit Associations
  Visit.belongsTo(Lead, { foreignKey: 'leadId' });
  Visit.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });
  Visit.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });
  Visit.belongsTo(Property, { foreignKey: 'propertyId' });
  Visit.belongsTo(Vehicle, { foreignKey: 'vehicleId' });

  // Message Associations
  Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
  Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });
  Message.belongsTo(Property, { foreignKey: 'propertyId' });
  Message.belongsTo(Vehicle, { foreignKey: 'vehicleId' });

  // Review Associations
  Review.belongsTo(User, { foreignKey: 'reviewerId', as: 'reviewer' });
  Review.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });
  Review.belongsTo(Property, { foreignKey: 'propertyId' });
  Review.belongsTo(Vehicle, { foreignKey: 'vehicleId' });

  // Notification Associations
  Notification.belongsTo(User, { foreignKey: 'userId' });

  // Transaction Associations
  Transaction.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });
  Transaction.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });
  Transaction.belongsTo(Property, { foreignKey: 'propertyId' });
  Transaction.belongsTo(Vehicle, { foreignKey: 'vehicleId' });
};

const initDB = async () => {
  try {
    defineAssociations();

    // Sincroniza os modelos com o banco de dados
    await sequelize.sync({ alter: true });
    console.log('✅ Banco de dados sincronizado com sucesso!');
    
    // Inserir usuários e dados de teste
    await seedDB();
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco de dados:', error.message);
    process.exit(1);
  }
};

module.exports = initDB;

