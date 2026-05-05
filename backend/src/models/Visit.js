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
    allowNull: true,
    references: { model: 'Properties', key: 'id' },
    onDelete: 'CASCADE'
  },

  vehicleId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'Vehicles', key: 'id' },
    onDelete: 'CASCADE'
  },

  leadId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Leads', key: 'id' },
    onDelete: 'CASCADE'
  },

  buyerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Users', key: 'id' },
    onDelete: 'CASCADE'
  },

  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Users', key: 'id' },
    onDelete: 'CASCADE'
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
