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
  User.hasMany(Property, { 
    foreignKey: 'sellerId', 
    as: 'properties',
    onDelete: 'CASCADE'
  });
  User.hasMany(Vehicle, { 
    foreignKey: 'sellerId', 
    as: 'vehicles',
    onDelete: 'CASCADE'
  });
  User.hasMany(Lead, { 
    foreignKey: 'sellerId', 
    as: 'leads',
    onDelete: 'CASCADE'
  });
  User.hasMany(Review, { 
    foreignKey: 'sellerId', 
    as: 'reviews',
    onDelete: 'CASCADE'
  });
  User.hasMany(Transaction, { 
    foreignKey: 'sellerId', 
    as: 'transactionsSold',
    onDelete: 'CASCADE'
  });
  User.hasMany(Transaction, { 
    foreignKey: 'buyerId', 
    as: 'transactionsBought',
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
  Property.hasMany(Message, { 
    foreignKey: 'propertyId',
    onDelete: 'SET NULL'
  });
  Property.hasMany(Review, { 
    foreignKey: 'propertyId',
    onDelete: 'SET NULL'
  });
  Property.hasMany(Transaction, { 
    foreignKey: 'propertyId',
    onDelete: 'SET NULL'
  });

  // Vehicle Associations
  Vehicle.belongsTo(User, { 
    foreignKey: 'sellerId', 
    as: 'seller',
    onDelete: 'CASCADE'
  });
  Vehicle.hasMany(VehicleImage, { 
    foreignKey: 'vehicleId', 
    as: 'images',
    onDelete: 'CASCADE'
  });
  Vehicle.hasMany(Favorite, { 
    foreignKey: 'vehicleId',
    onDelete: 'CASCADE'
  });
  Vehicle.hasMany(Lead, { 
    foreignKey: 'vehicleId', 
    as: 'leads',
    onDelete: 'CASCADE'
  });
  Vehicle.hasMany(Visit, { 
    foreignKey: 'vehicleId', 
    as: 'visits',
    onDelete: 'CASCADE'
  });
  Vehicle.hasMany(Message, { 
    foreignKey: 'vehicleId',
    onDelete: 'SET NULL'
  });
  Vehicle.hasMany(Review, { 
    foreignKey: 'vehicleId',
    onDelete: 'SET NULL'
  });
  Vehicle.hasMany(Transaction, { 
    foreignKey: 'vehicleId',
    onDelete: 'SET NULL'
  });

  // PropertyImage Associations
  PropertyImage.belongsTo(Property, { 
    foreignKey: 'propertyId',
    onDelete: 'CASCADE'
  });

  // VehicleImage Associations
  VehicleImage.belongsTo(Vehicle, { 
    foreignKey: 'vehicleId',
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
  Favorite.belongsTo(Vehicle, { 
    foreignKey: 'vehicleId',
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
  Lead.belongsTo(Vehicle, { 
    foreignKey: 'vehicleId',
    onDelete: 'CASCADE'
  });
  Lead.hasMany(Visit, { 
    foreignKey: 'leadId',
    onDelete: 'CASCADE'
  });
  Lead.hasMany(Message, { 
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
  Visit.belongsTo(Vehicle, { 
    foreignKey: 'vehicleId',
    onDelete: 'CASCADE'
  });

  // Message Associations
  Message.belongsTo(User, { 
    foreignKey: 'senderId', 
    as: 'sender',
    onDelete: 'CASCADE'
  });
  Message.belongsTo(User, { 
    foreignKey: 'receiverId', 
    as: 'receiver',
    onDelete: 'CASCADE'
  });
  Message.belongsTo(Property, { 
    foreignKey: 'propertyId',
    onDelete: 'SET NULL'
  });
  Message.belongsTo(Vehicle, { 
    foreignKey: 'vehicleId',
    onDelete: 'SET NULL'
  });

  // Review Associations
  Review.belongsTo(User, { 
    foreignKey: 'reviewerId', 
    as: 'reviewer',
    onDelete: 'CASCADE'
  });
  Review.belongsTo(User, { 
    foreignKey: 'sellerId', 
    as: 'seller',
    onDelete: 'CASCADE'
  });
  Review.belongsTo(Property, { 
    foreignKey: 'propertyId',
    onDelete: 'SET NULL'
  });
  Review.belongsTo(Vehicle, { 
    foreignKey: 'vehicleId',
    onDelete: 'SET NULL'
  });

  // Notification Associations
  Notification.belongsTo(User, { 
    foreignKey: 'userId',
    onDelete: 'CASCADE'
  });

  // Transaction Associations
  Transaction.belongsTo(User, { 
    foreignKey: 'buyerId', 
    as: 'buyer',
    onDelete: 'CASCADE'
  });
  Transaction.belongsTo(User, { 
    foreignKey: 'sellerId', 
    as: 'seller',
    onDelete: 'CASCADE'
  });
  Transaction.belongsTo(Property, { 
    foreignKey: 'propertyId',
    onDelete: 'SET NULL'
  });
  Transaction.belongsTo(Vehicle, { 
    foreignKey: 'vehicleId',
    onDelete: 'SET NULL'
  });
};

const initDB = async () => {
  try {
    defineAssociations();

    // Sincroniza os modelos com o banco de dados (force: true recria tudo)
    await sequelize.sync({ force: false });
    console.log('✅ Banco de dados sincronizado com sucesso!');
    
    // Inserir usuários e dados de teste
    await seedDB();
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco de dados:', error.message);
    process.exit(1);
  }
};

module.exports = initDB;

