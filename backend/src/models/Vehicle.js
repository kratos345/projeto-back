const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'seller_id',
    references: { model: 'Users', key: 'id' },
    onDelete: 'CASCADE'
  },

  title: {
    type: DataTypes.STRING(250),
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  category: {
    type: DataTypes.ENUM('Sedan', 'SUV', 'Hatch', 'Pickup', 'Esportivo', 'Moto', 'Caminhão', 'Van'),
    defaultValue: 'Sedan',
    allowNull: false
  },

  brand: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  model: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1900, max: 2100 }
  },

  price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: { min: 0 }
  },

  mileage: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 }
  },

  color: {
    type: DataTypes.STRING(50),
    allowNull: true
  },

  transmission: {
    type: DataTypes.ENUM('Manual', 'Automático', 'CVT'),
    defaultValue: 'Automático'
  },

  fuel: {
    type: DataTypes.ENUM('Gasolina', 'Diesel', 'Flex', 'Elétrico', 'Híbrido'),
    defaultValue: 'Flex'
  },

  seats: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    validate: { min: 1, max: 8 }
  },

  doors: {
    type: DataTypes.INTEGER,
    defaultValue: 4,
    validate: { min: 2, max: 5 }
  },

  licensePlate: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: true
  },

  engine: {
    type: DataTypes.STRING(50),
    allowNull: true
  },

  power: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: { min: 0 }
  },

  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  state: {
    type: DataTypes.STRING(2),
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM('disponivel', 'negociando', 'vendido', 'arquivado'),
    defaultValue: 'disponivel'
  },

  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
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
    { fields: ['city'] },
    { fields: ['status'] },
    { fields: ['price'] },
    { fields: ['featured'] },
    { fields: ['brand'] },
    { fields: ['year'] }
  ]
});

module.exports = Vehicle;
