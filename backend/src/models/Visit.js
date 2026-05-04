const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Visit = sequelize.define('Visit', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  property_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  lead_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  scheduled_date: {
    type: DataTypes.DATE,
    allowNull: true
  },

  status: {
    type: DataTypes.ENUM('agendada', 'realizada', 'cancelada'),
    defaultValue: 'agendada'
  },

  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }

}, {
  timestamps: true
});

module.exports = Visit;
