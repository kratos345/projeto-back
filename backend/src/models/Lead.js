const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Lead = sequelize.define('Lead', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  property_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  buyer_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },

  email: {
    type: DataTypes.STRING(150),
    allowNull: true
  },

  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },

  status: {
    type: DataTypes.ENUM('novo', 'contato_feito', 'visita_marcada', 'proposta', 'fechado'),
    defaultValue: 'novo'
  },

  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }

}, {
  timestamps: true
});

module.exports = Lead;
