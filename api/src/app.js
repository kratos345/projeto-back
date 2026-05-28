const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Configurar origens permitidas - mais flexível para diferentes máquinas
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174'
].filter(Boolean);

// Regex para qualquer localhost em desenvolvimento
const localhostRegex = /^http:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:[0-9]+)?$/;

app.use(cors({
  origin: (origin, callback) => {
    // Requisições sem origin (mobile apps, Postman, etc)
    if (!origin) {
      return callback(null, true);
    }
    
    // Verificar se é uma origem permitida
    const isAllowed = allowedOrigins.includes(origin) || localhostRegex.test(origin);
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS bloqueou: ${origin}`);
      callback(new Error('CORS policy does not allow access from this origin.'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));
app.use('/api', routes);
app.get('/health', (req, res) => res.json({ status: 'OK' }));
app.use(errorHandler);

module.exports = app;
