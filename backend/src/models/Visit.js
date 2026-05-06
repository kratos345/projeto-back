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
    field: 'property_id',
    references: { model: 'Properties', key: 'id' },
    onDelete: 'CASCADE'
  },

  vehicleId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'vehicle_id',
    references: { model: 'Vehicles', key: 'id' },
    onDelete: 'CASCADE'
  },

  leadId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'lead_id',
    references: { model: 'Leads', key: 'id' },
    onDelete: 'CASCADE'
  },

  buyerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'buyer_id',
    references: { model: 'Users', key: 'id' },
    onDelete: 'CASCADE'
  },

  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'seller_id',
    references: { model: 'Users', key: 'id' },
    onDelete: 'CASCADE'
  },

  scheduledDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'scheduled_date'
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
