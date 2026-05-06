const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'sender_id',
    references: { model: 'Users', key: 'id' },
    onDelete: 'CASCADE'
  },

  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'receiver_id',
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

  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  readAt: {
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
    { fields: ['senderId', 'receiverId'] },
    { fields: ['isRead'] },
    { fields: ['createdAt'] }
  ]
});

module.exports = Message;
