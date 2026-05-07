const mysql = require('mysql2/promise');
require('dotenv').config();

async function resetDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('🔄 Conectado ao MySQL...');

    // Drop database se existir
    await connection.execute(`DROP DATABASE IF EXISTS \`${process.env.DB_NAME}\``);
    console.log('✅ Banco de dados removido');

    // Create database
    await connection.execute(`CREATE DATABASE \`${process.env.DB_NAME}\``);
    console.log('✅ Banco de dados criado');

    await connection.end();
    console.log('✅ Reset do banco concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao resetar banco:', error.message);
    process.exit(1);
  }
}

resetDatabase();
