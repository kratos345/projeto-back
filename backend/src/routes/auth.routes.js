const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const { validateRegister, validateLogin } = require('../middlewares/validators');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');

router.post('/register', authMiddleware, roleMiddleware('admin'), validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

module.exports = router;
