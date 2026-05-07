const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/property.controller');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');

// 🟢 PÚBLICAS (qualquer um pode ver)
router.get('/', propertyController.getAll); // Listar com filtros

// 🔵 VENDEDOR (precisa estar autenticado e ser vendedor)
router.post('/', authMiddleware, roleMiddleware('vendedor', 'admin'), propertyController.create); // Criar
router.get('/vendedor/minhas', authMiddleware, roleMiddleware('vendedor'), propertyController.getByVendedor); // Suas propriedades
router.get('/:id', propertyController.getById); // Ver detalhes
router.put('/:id', authMiddleware, propertyController.update); // Atualizar
router.delete('/:id', authMiddleware, propertyController.delete); // Deletar

// 🟢 ADMIN (aprovação)
router.post('/:id/approve', authMiddleware, roleMiddleware('admin'), propertyController.approve);
router.post('/:id/reject', authMiddleware, roleMiddleware('admin'), propertyController.reject);

module.exports = router;
