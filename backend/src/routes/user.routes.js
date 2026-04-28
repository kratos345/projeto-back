const { Router } = require('express');
const { getAll, getById, update, remove } = require('../controllers/user.controller');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = Router();
router.use(authMiddleware);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
