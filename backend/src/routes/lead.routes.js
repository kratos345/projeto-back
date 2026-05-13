const express = require('express');
const router = express.Router();
const leadController = require('../controllers/lead.controller');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');

// 🟢 CRIAR lead (qualquer um pode criar)
router.post('/', leadController.create);

// 🔵 VENDEDOR - Ver seus leads
router.get('/vendedor/meus', authMiddleware, roleMiddleware('vendedor'), leadController.getByVendedor);
router.get('/vendedor/metrics', authMiddleware, roleMiddleware('vendedor'), leadController.getMetrics);

// 🟣 POR PROPRIEDADE
router.get('/property/:id', authMiddleware, leadController.getByProperty);

// 🟡 ATUALIZAR status
router.put('/:id/status', authMiddleware, leadController.updateStatus);

// 🔴 FECHAR lead (encerrar aplicação)
router.post('/:id/close', authMiddleware, leadController.closeLead);

module.exports = router;
