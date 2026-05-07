const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Visit = sequelize.define('Visit', {
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

  leadId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  buyerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  scheduledDate: {
    type: DataTypes.DATE,
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM('agendada', 'realizada', 'cancelada', 'nao_compareceu'),
    defaultValue: 'agendada'
  },

  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  feedbackScore: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: { min: 1, max: 5 }
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
    { fields: ['leadId'] },
    { fields: ['buyerId'] },
    { fields: ['sellerId'] },
    { fields: ['status'] },
    { fields: ['scheduledDate'] }
  ]
});

module.exports = Visit;
