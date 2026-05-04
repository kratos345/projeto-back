const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  property_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }

}, {
  timestamps: true
});

module.exports = Favorite;
