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
    allowNull: false
  },

  receiverId: {
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
