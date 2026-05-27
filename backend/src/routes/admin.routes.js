const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');
const requestController = require('../controllers/request.controller');

router.get('/requests', authMiddleware, roleMiddleware('admin'), requestController.list);
router.post('/requests/:id/status', authMiddleware, roleMiddleware('admin'), requestController.updateStatus);

module.exports = router;
