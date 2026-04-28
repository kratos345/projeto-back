require('dotenv').config();
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

app.use('/api', routes);
app.get('/health', (req, res) => res.json({ status: 'OK' }));

app.use(errorHandler);

// Inicializar banco de dados e iniciar servidor
const PORT = process.env.PORT || 3001;

(async () => {
  try {
    // Sincroniza o banco de dados
    await initDB();
    
    app.listen(PORT, () => {
      console.log(`✅ Servidor rodando na porta ${PORT}`);
      console.log(`📝 Acesse: http://localhost:${PORT}/api/`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
})();