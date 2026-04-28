const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedDB = async () => {
  try {
    // Verificar se já existem usuários
    const userCount = await User.count();
    
    if (userCount > 0) {
      console.log('✅ Usuários já existem no banco de dados.');
      return;
    }

    // Hash da senha '123456'
    const password = await bcrypt.hash('123456', 10);

    // Criar usuários de teste
    const users = await User.bulkCreate([
      {
        name: 'Admin',
        email: 'admin@example.com',
        password: password,
        role: 'admin'
      },
      {
        name: 'Vendedor',
        email: 'vendedor@example.com',
        password: password,
        role: 'vendedor'
      },
      {
        name: 'Usuario',
        email: 'usuario@example.com',
        password: password,
        role: 'user'
      }
    ]);

    console.log('✅ 3 usuários de teste criados com sucesso!');
    console.log('   📧 admin@example.com / 123456');
    console.log('   📧 vendedor@example.com / 123456');
    console.log('   📧 usuario@example.com / 123456');

  } catch (error) {
    console.error('❌ Erro ao criar usuários de teste:', error.message);
  }
};

module.exports = seedDB;
