const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');

// 📊 ADMIN - Dashboard Admin
router.get('/admin/metrics', authMiddleware, roleMiddleware('admin'), dashboardController.adminMetrics);

// 📊 VENDEDOR - Dashboard Vendedor
router.get('/seller/metrics', authMiddleware, roleMiddleware('vendedor'), dashboardController.sellerMetrics);

module.exports = router;
