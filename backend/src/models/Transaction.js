const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  buyerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  vehicleId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  itemType: {
    type: DataTypes.ENUM('property', 'vehicle'),
    allowNull: false
  },

  itemTitle: {
    type: DataTypes.STRING(250),
    allowNull: false
  },

  finalPrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },

  originalPrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },

  discount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },

  status: {
    type: DataTypes.ENUM('pendente', 'confirmada', 'entregue', 'cancelada'),
    defaultValue: 'confirmada'
  },

  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
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
    { fields: ['buyerId'] },
    { fields: ['sellerId'] },
    { fields: ['status'] },
    { fields: ['completedAt'] }
  ]
});

module.exports = Transaction;
