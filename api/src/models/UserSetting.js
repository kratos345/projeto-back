const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserSetting = sequelize.define('UserSetting', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  preferences: {
    type: DataTypes.JSON,
    allowNull: true
  },
  language: {
    type: DataTypes.STRING(10),
    defaultValue: 'pt-BR'
  },
  notificationsEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
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
    { fields: ['userId'] }
  ]
});

module.exports = UserSetting;
