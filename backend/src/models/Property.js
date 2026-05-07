const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Property = sequelize.define('Property', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  title: {
    type: DataTypes.STRING(250),
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  type: {
    type: DataTypes.ENUM('Casa', 'Apartamento', 'Cobertura', 'Terreno', 'Comercial', 'Galpão'),
    defaultValue: 'Casa',
    allowNull: false
  },

  price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: { min: 0 }
  },

  bedrooms: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0 }
  },

  bathrooms: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0 }
  },

  area: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: { min: 0 }
  },

  street: {
    type: DataTypes.STRING(200),
    allowNull: false
  },

  number: {
    type: DataTypes.STRING(20),
    allowNull: false
  },

  complement: {
    type: DataTypes.STRING(150),
    allowNull: true
  },

  neighborhood: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  state: {
    type: DataTypes.STRING(2),
    allowNull: false
  },

  zipCode: {
    type: DataTypes.STRING(20),
    allowNull: true
  },

  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },

  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },

  status: {
    type: DataTypes.ENUM('disponivel', 'negociando', 'vendido', 'arquivado'),
    defaultValue: 'disponivel'
  },

  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },

  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['sellerId'] },
    { fields: ['city'] },
    { fields: ['status'] },
    { fields: ['price'] },
    { fields: ['featured'] }
  ]
});

module.exports = Property;
