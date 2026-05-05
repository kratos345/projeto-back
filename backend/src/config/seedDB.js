const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Property = require('../models/Property');
const Vehicle = require('../models/Vehicle');
const PropertyImage = require('../models/PropertyImage');
const VehicleImage = require('../models/VehicleImage');
const Favorite = require('../models/Favorite');
const Lead = require('../models/Lead');
const Review = require('../models/Review');

const seedDB = async () => {
  try {
    const propertyCount = await Property.count();
    if (propertyCount > 0) {
      console.log('✅ Dados já existem. Pulando seed.');
      return;
    }

    console.log('🌱 Iniciando seed (SEM usuários)...');

    // 🔥 Buscar usuários existentes
    const users = await User.findAll();

    if (users.length < 3) {
      console.log('⚠️ Você precisa ter pelo menos 3 usuários cadastrados.');
      console.log('👉 Crie usuários manualmente antes do seed.');
      return;
    }

    // Pegar usuários existentes
    const seller1 = users[0];
    const seller2 = users[1];
    const seller3 = users[2];
    const user1 = users[3] || users[0];
    const user2 = users[4] || users[1];

    // ============================================================
    // IMÓVEIS
    // ============================================================
    const prop1 = await Property.create({
      sellerId: seller1.id,
      title: 'Casa Moderna',
      description: 'Casa com piscina e área gourmet',
      category: 'Casa',
      price: 980000,
      beds: 4,
      baths: 3,
      area: 320,
      city: 'São Paulo',
      state: 'SP',
      status: 'disponivel',
      featured: true
    });

    const prop2 = await Property.create({
      sellerId: seller2.id,
      title: 'Apartamento de Luxo',
      description: 'Vista para o mar',
      category: 'Apartamento',
      price: 1450000,
      beds: 3,
      baths: 2,
      area: 140,
      city: 'Balneário Camboriú',
      state: 'SC',
      status: 'disponivel'
    });

    console.log('✅ Imóveis criados!');

    // ============================================================
    // VEÍCULOS
    // ============================================================
    const veh1 = await Vehicle.create({
      sellerId: seller2.id,
      title: 'BMW X5',
      category: 'SUV',
      brand: 'BMW',
      model: 'X5',
      year: 2024,
      price: 520000,
      mileage: 8000,
      city: 'São Paulo',
      state: 'SP',
      status: 'disponivel'
    });

    console.log('✅ Veículos criados!');

    // ============================================================
    // IMAGENS
    // ============================================================
    await PropertyImage.create({
      propertyId: prop1.id,
      url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be'
    });

    await VehicleImage.create({
      vehicleId: veh1.id,
      url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e'
    });

    console.log('✅ Imagens criadas!');

    // ============================================================
    // FAVORITOS
    // ============================================================
    await Favorite.create({
      userId: user1.id,
      propertyId: prop1.id,
      itemType: 'property'
    });

    console.log('✅ Favoritos criados!');

    // ============================================================
    // LEADS
    // ============================================================
    await Lead.create({
      propertyId: prop1.id,
      sellerId: seller1.id,
      buyerId: user1.id,
      name: 'Cliente Teste',
      email: 'cliente@email.com',
      status: 'novo'
    });

    console.log('✅ Leads criados!');

    // ============================================================
    // REVIEWS
    // ============================================================
    await Review.create({
      reviewerId: user1.id,
      sellerId: seller1.id,
      propertyId: prop1.id,
      rating: 5,
      comment: 'Ótimo vendedor!'
    });

    console.log('✅ Reviews criados!');

    console.log('\n🎉 Seed concluído SEM criar usuários!\n');

  } catch (error) {
    console.error('❌ Erro no seed:', error.message);
  }
};

module.exports = seedDB;