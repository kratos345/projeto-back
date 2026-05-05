const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },

  cpfCnpj: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: true
  },

  role: {
    type: DataTypes.ENUM('admin', 'vendedor', 'user'),
    defaultValue: 'user'
  },

  company: {
    type: DataTypes.STRING(200),
    allowNull: true
  },

  creci: {
    type: DataTypes.STRING(50),
    allowNull: true
  },

  website: {
    type: DataTypes.STRING(200),
    allowNull: true
  },

  profileImage: {
    type: DataTypes.STRING(500),
    allowNull: true
  },

  status: {
    type: DataTypes.ENUM('ativo', 'inativo', 'bloqueado'),
    defaultValue: 'ativo'
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
    { fields: ['email'], unique: true },
    { fields: ['cpfCnpj'] },
    { fields: ['role'] }
  ]
});

module.exports = User;