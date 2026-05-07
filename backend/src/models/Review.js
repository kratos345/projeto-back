const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  reviewerId: {
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

  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },

  title: {
    type: DataTypes.STRING(200),
    allowNull: true
  },

  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  isVerified: {
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
    { fields: ['sellerId'] },
    { fields: ['reviewerId'] },
    { fields: ['rating'] }
  ]
});

module.exports = Review;
