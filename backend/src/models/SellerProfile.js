const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SellerProfile = sequelize.define('SellerProfile', {
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
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
    validate: { min: 0, max: 5 }
  },
  totalSales: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  commissionRate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.0
  },
  activeSince: {
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
    { fields: ['userId'] }
  ]
});

module.exports = SellerProfile;
