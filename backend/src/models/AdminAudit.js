const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AdminAudit = sequelize.define('AdminAudit', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  action: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  entity: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  entityId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
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
    { fields: ['userId'] },
    { fields: ['action'] },
    { fields: ['entity'] }
  ]
});

module.exports = AdminAudit;
