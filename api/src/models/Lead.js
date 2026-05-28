const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Lead = sequelize.define('Lead', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  vehicleId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  buyerId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  name: {
    type: DataTypes.STRING(150),
    allowNull: true
  },

  email: {
    type: DataTypes.STRING(150),
    allowNull: true,
    validate: { isEmail: true }
  },

  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },

  status: {
    type: DataTypes.ENUM('novo', 'contatado', 'visita_agendada', 'proposta_enviada', 'negociando', 'fechado', 'perdido'),
    defaultValue: 'novo'
  },

  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  source: {
    type: DataTypes.ENUM('website', 'app', 'phone', 'whatsapp', 'email'),
    defaultValue: 'website'
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
    { fields: ['buyerId'] },
    { fields: ['status'] },
    { fields: ['propertyId'] },
    { fields: ['vehicleId'] }
  ]
});

module.exports = Lead;
