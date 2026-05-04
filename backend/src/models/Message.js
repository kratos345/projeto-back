const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  property_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }

}, {
  timestamps: true
});

module.exports = Message;
