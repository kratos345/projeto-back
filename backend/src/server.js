const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');
const initDB = require('./config/initDB');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

app.use('/api', routes);
app.get('/health', (req, res) => res.json({ status: 'OK' }));

app.use(errorHandler);

// Inicializar banco de dados e iniciar servidor
const PORT = process.env.PORT || 3001;

(async () => {
  try {
    // Sincroniza o banco de dados
    await initDB();
    
    const server = app.listen(PORT, () => {
      console.log(`✅ Servidor rodando na porta ${PORT}`);
      console.log(`📝 Acesse: http://localhost:${PORT}/api/`);
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