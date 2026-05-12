const { Router } = require('express');
const { getAll, getById, update, updateMe, getMe, remove, uploadAvatar } = require('../controllers/user.controller');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

const router = Router();
router.use(authMiddleware);

// Perfil do usuário autenticado
router.get('/me', getMe);
router.put('/me', updateMe);
router.post('/me/avatar', upload.single('avatar'), uploadAvatar);

// Apenas admins podem listar/deletar usuários
router.get('/', roleMiddleware('admin'), getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', roleMiddleware('admin'), remove);

module.exports = router;
