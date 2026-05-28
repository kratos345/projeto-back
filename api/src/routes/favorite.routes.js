const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite.controller');
const { authMiddleware } = require('../middlewares/authMiddleware');

// 🟢 ADICIONAR aos favoritos
router.post('/', authMiddleware, favoriteController.add);

// 🔵 REMOVER dos favoritos
router.delete('/:property_id', authMiddleware, favoriteController.remove);

// 🟣 LISTAR favoritos do usuário
router.get('/', authMiddleware, favoriteController.getByUser);

module.exports = router;
