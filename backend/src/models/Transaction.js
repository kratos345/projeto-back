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

  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'property_id',
    references: { model: 'Properties', key: 'id' },
    onDelete: 'SET NULL'
  },

  vehicleId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'vehicle_id',
    references: { model: 'Vehicles', key: 'id' },
    onDelete: 'SET NULL'
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
