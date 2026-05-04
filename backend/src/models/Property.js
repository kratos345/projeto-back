const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Property = sequelize.define('Property', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  type: {
    type: DataTypes.ENUM('casa', 'apartamento', 'terreno', 'comercial'),
    defaultValue: 'apartamento'
  },

  price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },

  bedrooms: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  bathrooms: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  area: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },

  address: {
    type: DataTypes.STRING(255),
    allowNull: true
  },

  city: {
    type: DataTypes.STRING(100),
    allowNull: true
  },

  state: {
    type: DataTypes.STRING(50),
    allowNull: true
  },

  zipCode: {
    type: DataTypes.STRING(10),
    allowNull: true
  },

  seller_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM('ativo', 'vendido', 'pendente'),
    defaultValue: 'pendente'
  },

  featured_image: {
    type: DataTypes.STRING(500),
    allowNull: true
  },

  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }

}, {
  timestamps: true
});

module.exports = Property;
