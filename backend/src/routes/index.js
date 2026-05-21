const { Router } = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const propertyRoutes = require('./property.routes');
const leadRoutes = require('./lead.routes');
const favoriteRoutes = require('./favorite.routes');
const visitRoutes = require('./visit.routes');
const dashboardRoutes = require('./dashboard.routes');

const router = Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API do backend funcionando',
    routes: [
      '/auth',
      '/users',
      '/properties',
      '/leads',
      '/favorites',
      '/visits',
      '/dashboard'
    ]
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/properties', propertyRoutes);
router.use('/leads', leadRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/visits', visitRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
