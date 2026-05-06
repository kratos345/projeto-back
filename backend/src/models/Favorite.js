const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: { model: 'Users', key: 'id' },
    onDelete: 'CASCADE'
  },

  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'property_id',
    references: { model: 'Properties', key: 'id' },
    onDelete: 'CASCADE'
  },

  vehicleId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'vehicle_id',
    references: { model: 'Vehicles', key: 'id' },
    onDelete: 'CASCADE'
  },

  itemType: {
    type: DataTypes.ENUM('property', 'vehicle'),
    allowNull: false
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
  indexes: [{ fields: ['userId', 'itemType'] }]
});

module.exports = Favorite;
