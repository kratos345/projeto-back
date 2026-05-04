const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visit.controller');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');

// 🟢 AGENDAR visita
router.post('/', authMiddleware, visitController.create);

// 🔵 LISTAR visitas de um lead
router.get('/lead/:id', authMiddleware, visitController.getByLead);

// 🟡 ATUALIZAR status
router.put('/:id/status', authMiddleware, roleMiddleware('vendedor', 'admin'), visitController.updateStatus);

module.exports = router;
