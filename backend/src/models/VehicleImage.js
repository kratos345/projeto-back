const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const VehicleImage = sequelize.define('VehicleImage', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  vehicleId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  url: {
    type: DataTypes.STRING(500),
    allowNull: false
  },

  caption: {
    type: DataTypes.STRING(200),
    allowNull: true
  },

  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
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
    { fields: ['vehicleId'] }
  ]
});

module.exports = VehicleImage;
