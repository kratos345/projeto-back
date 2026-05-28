const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const initDB = require('./config/initDB');
const app = require('./app');

// Inicializar banco de dados e iniciar servidor
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

(async () => {
  try {
    // Sincroniza o banco de dados
    await initDB();
    
    const server = app.listen(PORT, HOST, () => {
      const accessUrl = HOST === '0.0.0.0' ? 'localhost' : HOST;
      console.log(`✅ Servidor rodando na porta ${PORT}`);
      console.log(`📝 Acesse localmente: http://${accessUrl}:${PORT}/api/`);
      console.log(`🌐 Para outra máquina na rede, use o IP da máquina: http://[SEU_IP]:${PORT}/api/`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Porta ${PORT} em uso. Finalize o processo que está usando a porta ou altere PORT no arquivo .env.`);
        process.exit(1);
      }
      console.error('❌ Erro no servidor:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
})();