const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define('Notification', {
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

  type: {
    type: DataTypes.ENUM(
      'novo_lead',
      'lead_atualizado',
      'visita_agendada',
      'mensagem_nova',
      'imovel_vendido',
      'veiculo_vendido',
      'novo_favorito',
      'proposta_recebida',
      'sistema'
    ),
    allowNull: false
  },

  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },

  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  relatedEntityId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  relatedEntityType: {
    type: DataTypes.ENUM('property', 'vehicle', 'lead', 'visit', 'message'),
    allowNull: true
  },

  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  readAt: {
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
    { fields: ['userId'] },
    { fields: ['isRead'] },
    { fields: ['createdAt'] }
  ]
});

module.exports = Notification;
