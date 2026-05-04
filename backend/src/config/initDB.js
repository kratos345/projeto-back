const { sequelize } = require('../config/database');
const User = require('../models/User');
const Property = require('../models/Property');
const Lead = require('../models/Lead');
const Favorite = require('../models/Favorite');
const Visit = require('../models/Visit');
const Message = require('../models/Message');
const seedDB = require('./seedDB');

const initDB = async () => {
  try {
    // Sincroniza o modelo com o banco de dados
    // { alter: true } modifica tabelas existentes para corresponder ao modelo
    // { force: false } NÃO deleta dados existentes
    await sequelize.sync({ alter: true });
    console.log('✅ Banco de dados sincronizado com sucesso!');
    
    // Inserir usuários de teste
    await seedDB();
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco de dados:', error.message);
    process.exit(1);
  }
};

module.exports = initDB;
