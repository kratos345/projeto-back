const path = require('path');
const fs = require('fs');
const { Sequelize } = require('sequelize');

const storage = process.env.DB_STORAGE
  ? path.isAbsolute(process.env.DB_STORAGE)
    ? process.env.DB_STORAGE
    : path.resolve(__dirname, '../../', process.env.DB_STORAGE)
  : path.resolve(__dirname, '../../database.sqlite');
const storageDir = path.dirname(storage);

if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
  logging: false,
});

module.exports = { sequelize };
