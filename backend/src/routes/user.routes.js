const { Router } = require('express');
const { getAll, getById, update, updateMe, getMe, remove } = require('../controllers/user.controller');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');

const router = Router();
router.use(authMiddleware);

// Perfil do usuário autenticado
router.get('/me', getMe);
router.put('/me', updateMe);

// Apenas admins podem listar/deletar usuários
router.get('/', roleMiddleware('admin'), getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', roleMiddleware('admin'), remove);

module.exports = router;
