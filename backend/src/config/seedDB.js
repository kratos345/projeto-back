const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Property = require('../models/Property');
const PropertyImage = require('../models/PropertyImage');
const Favorite = require('../models/Favorite');
const Lead = require('../models/Lead');
const Notification = require('../models/Notification');
const SellerProfile = require('../models/SellerProfile');
const UserSetting = require('../models/UserSetting');

const seedDB = async () => {
  try {
    const adminEmail = 'leonardoferreiratomas345@gmail.com';
    const adminName = 'Administrador';
    const adminPassword = '321654';
    const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
    const shouldSeedProperties = process.env.SEED_DB === 'true';

    const fakeEmails = [
      'admin@example.com',
      'vendedor@example.com',
      'comprador@example.com',
      'teste_autobot@example.com',
      'qa_test_user2@example.com',
      'qa_seller@example.com',
      'explorar_tester@example.com',
      'leonardoferreiratomas234@gmail.com'
    ];

    await User.destroy({
      where: {
        email: fakeEmails
      }
    });

    const [adminUser, adminCreated] = await User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        name: adminName,
        password: adminPasswordHash,
        role: 'admin',
        status: 'ativo'
      }
    });

    if (adminCreated) {
      console.log('✅ Usuário ADM criado automaticamente:', adminEmail);
    } else {
      const updateData = {};
      if (adminUser.role !== 'admin') updateData.role = 'admin';
      if (adminUser.status !== 'ativo') updateData.status = 'ativo';
      const passwordMatches = await bcrypt.compare(adminPassword, adminUser.password);
      if (!passwordMatches) updateData.password = adminPasswordHash;
      if (Object.keys(updateData).length > 0) {
        await adminUser.update(updateData);
        console.log('✅ Usuário ADM atualizado automaticamente:', adminEmail);
      }
    }

    const propertyCount = await Property.count();
    if (!shouldSeedProperties) {
      const deleted = await Property.destroy({
        where: {
          title: ['Casa Moderna', 'Apartamento de Luxo']
        }
      });
      if (deleted > 0) {
        console.log('✅ Propriedades de seed falsas removidas.');
      }
      console.log('⚠️ Seed de propriedades desativado. Nenhum anúncio falso será criado.');
      return;
    }

    if (propertyCount > 0) {
      console.log('✅ Dados já existem. Pulando seed.');
      return;
    }

    console.log('🌱 Iniciando seed...');

    const users = await User.findAll({ order: [['id', 'ASC']] });

    const seller1 = users.find((u) => u.role === 'vendedor') || users[0];
    const seller2 = users.find((u) => u.role === 'admin') || users[1] || users[0];
    const user1 = users.find((u) => u.role === 'user') || users[0];

    // ============================================================
    // IMÓVEIS
    // ============================================================
    const prop1 = await Property.create({
      sellerId: seller1.id,
      title: 'Casa Moderna',
      description: 'Casa com piscina e área gourmet',
      type: 'Casa',
      price: 980000,
      bedrooms: 4,
      bathrooms: 3,
      area: 320,
      street: 'Rua das Flores',
      number: '123',
      complement: 'Casa',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      status: 'ativo',
      featured: true
    });

    const prop2 = await Property.create({
      sellerId: seller2.id,
      title: 'Apartamento de Luxo',
      description: 'Vista para o mar',
      type: 'Apartamento',
      price: 1450000,
      bedrooms: 3,
      bathrooms: 2,
      area: 140,
      street: 'Avenida Atlântica',
      number: '456',
      complement: 'Apt 101',
      neighborhood: 'Praia Central',
      city: 'Balneário Camboriú',
      state: 'SC',
      zipCode: '88330-000',
      status: 'ativo'
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

    await SellerProfile.create({
      userId: seller1.id,
      bio: 'Vendedor com ampla experiência em imóveis residenciais e comerciais.',
      rating: 4.9,
      totalSales: 12,
      commissionRate: 5.5,
      activeSince: new Date()
    });

    await UserSetting.create({
      userId: user1.id,
      preferences: { darkMode: false, receiveEmails: true },
      language: 'pt-BR',
      notificationsEnabled: true
    });

    await Notification.create({
      userId: user1.id,
      type: 'welcome',
      title: 'Bem-vindo ao sistema',
      message: 'Seu cadastro foi criado com sucesso. Explore os imóveis e entre em contato com nossos vendedores.',
      metadata: { target: '/dashboard' }
    });

    console.log('✅ Leads criados!');

  } catch (error) {
    console.error('❌ Erro no seed:', error.message);
  }
};

module.exports = seedDB;