const { sequelize } = require('../config/database');
const User = require('../models/User');
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
