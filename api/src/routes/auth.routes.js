const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const requestController = require('../controllers/request.controller');
const { validateRegister, validateLogin } = require('../middlewares/validators');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/request-account', requestController.create);

module.exports = router;
