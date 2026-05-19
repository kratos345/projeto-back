const fs = require('fs');
const path = require('path');
const { sequelize } = require('../config/database');
const User = require('../models/User');
const Property = require('../models/Property');
const PropertyImage = require('../models/PropertyImage');
const Favorite = require('../models/Favorite');
const Lead = require('../models/Lead');
const Visit = require('../models/Visit');
const seedDB = require('./seedDB');

const storageFile = path.resolve(__dirname, '../../', process.env.DB_STORAGE || './database.sqlite');

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


};

const initDB = async () => {
  try {
    await sequelize.authenticate();
    defineAssociations();

    try {
      await sequelize.sync({ alter: true });
    } catch (syncError) {
      console.warn('⚠️ Falha no sync alter do SQLite. Recriando o banco local...');
      if (fs.existsSync(storageFile)) {
        await sequelize.close();
        fs.unlinkSync(storageFile);
        console.log(`🧹 Arquivo removido: ${storageFile}`);
      }
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

