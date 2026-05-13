const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/property.controller');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');
const { createUploadMiddleware } = require('../middlewares/uploadMiddleware');
const { validatePropertyCreate, handleValidationErrors } = require('../middlewares/validators');

// 🟢 PÚBLICAS (qualquer um pode ver)
router.get('/', propertyController.getAll); // Listar com filtros

// 🔵 VENDEDOR (precisa estar autenticado e ser vendedor)
router.post('/', authMiddleware, roleMiddleware('vendedor', 'admin'), validatePropertyCreate, handleValidationErrors, propertyController.create); // Criar
router.get('/vendedor/minhas', authMiddleware, roleMiddleware('vendedor'), propertyController.getByVendedor); // Suas propriedades
router.get('/:id', propertyController.getById); // Ver detalhes
router.put('/:id', authMiddleware, validatePropertyCreate, handleValidationErrors, propertyController.update); // Atualizar
router.delete('/:id', authMiddleware, propertyController.delete); // Deletar
router.post('/:id/images', authMiddleware, roleMiddleware('vendedor', 'admin'), createUploadMiddleware('properties').array('images', 6), propertyController.uploadPropertyImages);
router.delete('/:id/images/:imageId', authMiddleware, roleMiddleware('vendedor', 'admin'), propertyController.deletePropertyImage);

// 🟢 ADMIN (aprovação)
router.post('/:id/approve', authMiddleware, roleMiddleware('admin'), propertyController.approve);
router.post('/:id/reject', authMiddleware, roleMiddleware('admin'), propertyController.reject);

module.exports = router;
