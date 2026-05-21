const { Router } = require('express');
const { getAll, getById, update, updateMe, getMe, remove, uploadAvatar, getSellers, getSellerSales, getMyPurchases } = require('../controllers/user.controller');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

const router = Router();
router.use(authMiddleware);

// Perfil do usuário autenticado
router.get('/me', getMe);
router.put('/me', updateMe);
router.post('/me/avatar', upload.single('avatar'), uploadAvatar);

// Ver vendedores e vendas de vendedores
router.get('/sellers', getSellers);
router.get('/sellers/:id/sales', getSellerSales);
router.get('/me/purchases', getMyPurchases);

// Apenas admins podem listar, visualizar, atualizar ou deletar usuários
router.get('/', roleMiddleware('admin'), getAll);
router.get('/:id', roleMiddleware('admin'), getById);
router.put('/:id', roleMiddleware('admin'), update);
router.delete('/:id', roleMiddleware('admin'), remove);

module.exports = router;
