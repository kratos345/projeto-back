const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Property = require('../models/Property');
const PropertyImage = require('../models/PropertyImage');
const Favorite = require('../models/Favorite');
const Lead = require('../models/Lead');

const seedDB = async () => {
  try {
    const propertyCount = await Property.count();
    if (propertyCount > 0) {
      console.log('✅ Dados já existem. Pulando seed.');
      return;
    }

    console.log('🌱 Iniciando seed...');

    // 🔥 Buscar usuários existentes
    let users = await User.findAll();

    if (users.length === 0) {
      console.log('⚠️ Nenhum usuário encontrado. Por favor, crie um usuário primeiro via registro.');
      return;
    }

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
      street: 'Rua das Flores',
      number: '123',
      complement: 'Casa',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
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
      street: 'Avenida Atlântica',
      number: '456',
      complement: 'Apt 101',
      neighborhood: 'Praia Central',
      city: 'Balneário Camboriú',
      state: 'SC',
      zipCode: '88330-000',
      status: 'disponivel'
    });

    console.log('✅ Imóveis criados!');

    // ============================================================
    // IMAGENS
    // ============================================================
    await PropertyImage.create({
      propertyId: prop1.id,
      url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be'
    });

    console.log('✅ Imagens criadas!');

    // ============================================================
    // FAVORITOS
    // ============================================================
    await Favorite.create({
      userId: user1.id,
      propertyId: prop1.id
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

    console.log('\n🎉 Seed concluído SEM criar usuários!\n');

  } catch (error) {
    console.error('❌ Erro no seed:', error.message);
  }
};

module.exports = seedDB;