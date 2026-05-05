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
    const userCount = await User.count();
    if (userCount > 0) {
      console.log('✅ Dados de teste já existem. Pulando seed.');
      return;
    }

    console.log('🌱 Iniciando seed do banco de dados...');
    const hashPassword = (pwd) => bcrypt.hashSync(pwd, 10);

    // Criar usuários
    const admin = await User.create({
      name: 'Admin Sistema', email: 'admin@primevenda.com', password: hashPassword('123456'),
      phone: '(11) 98888-0000', role: 'admin', company: 'PrimeVenda', status: 'ativo'
    });

    const seller1 = await User.create({
      name: 'Carlos Mendes', email: 'carlos@primevenda.com', password: hashPassword('123456'),
      phone: '(11) 98888-1111', cpfCnpj: '12345678901234', role: 'vendedor',
      company: 'Carlos Mendes Imóveis', creci: '123456-SP', website: 'www.carlosmendes.com.br', status: 'ativo'
    });

    const seller2 = await User.create({
      name: 'Ana Santos', email: 'ana@primevenda.com', password: hashPassword('123456'),
      phone: '(11) 98888-2222', cpfCnpj: '98765432109876', role: 'vendedor',
      company: 'Ana Santos Corretora', creci: '789012-SP', status: 'ativo'
    });

    const seller3 = await User.create({
      name: 'Roberto Faria', email: 'roberto@primevenda.com', password: hashPassword('123456'),
      phone: '(11) 98888-3333', cpfCnpj: '11122233344455', role: 'vendedor',
      company: 'RF Consultoria Imobiliária', creci: '345678-SP', status: 'ativo'
    });

    const user1 = await User.create({
      name: 'João Silva', email: 'joao@email.com', password: hashPassword('123456'),
      phone: '(11) 99999-1111', cpfCnpj: '12345678901', role: 'user', status: 'ativo'
    });

    const user2 = await User.create({
      name: 'Maria Oliveira', email: 'maria@email.com', password: hashPassword('123456'),
      phone: '(11) 99999-2222', cpfCnpj: '98765432109', role: 'user', status: 'ativo'
    });

    console.log('✅ Usuários criados!');

    // Criar imóveis
    const prop1 = await Property.create({
      sellerId: seller1.id, title: 'Casa Moderna em Alphaville',
      description: 'Linda casa moderna com acabamento premium, piscina, churrasqueira e jardim.',
      category: 'Casa', price: 980000, beds: 4, baths: 3, area: 320,
      street: 'Rua das Flores', number: '123', neighborhood: 'Alphaville',
      city: 'Barueri', state: 'SP', zipCode: '06450-000', status: 'disponivel', featured: true, views: 156
    });

    const prop2 = await Property.create({
      sellerId: seller2.id, title: 'Apartamento Luxo Beira-Mar',
      description: 'Apartamento de alto padrão com vista panorâmica para o mar.',
      category: 'Apartamento', price: 1450000, beds: 3, baths: 2, area: 140,
      street: 'Avenida Oceano', number: '500', neighborhood: 'Centro',
      city: 'Balneário Camboriú', state: 'SC', zipCode: '88330-000', status: 'disponivel', featured: true, views: 234
    });

    const prop3 = await Property.create({
      sellerId: seller3.id, title: 'Cobertura Duplex Jardins',
      description: 'Cobertura exclusiva no coração dos Jardins, terraço gourmet.',
      category: 'Cobertura', price: 2800000, beds: 5, baths: 4, area: 480,
      street: 'Rua Augusta', number: '1000', neighborhood: 'Jardins',
      city: 'São Paulo', state: 'SP', zipCode: '01305-100', status: 'negociando', featured: false, views: 89
    });

    console.log('✅ Imóveis criados!');

    // Criar veículos
    const veh1 = await Vehicle.create({
      sellerId: seller2.id, title: 'BMW X5 M Sport 2024',
      description: 'BMW X5 M Sport impecável, único dono, todos os adicionais de fábrica.',
      category: 'SUV', brand: 'BMW', model: 'X5 M Sport', year: 2024,
      price: 520000, mileage: 8000, color: 'Preto', transmission: 'Automático',
      fuel: 'Gasolina', seats: 5, doors: 4, licensePlate: 'ABC1234',
      city: 'São Paulo', state: 'SP', status: 'disponivel', featured: true, views: 178
    });

    const veh2 = await Vehicle.create({
      sellerId: seller3.id, title: 'Mercedes-Benz C300 2023',
      description: 'C300 em perfeito estado, interior caramelo, teto solar panorâmico.',
      category: 'Sedan', brand: 'Mercedes-Benz', model: 'C300', year: 2023,
      price: 368000, mileage: 22000, color: 'Prata', transmission: 'Automático',
      fuel: 'Gasolina', seats: 5, doors: 4, licensePlate: 'XYZ5678',
      city: 'Curitiba', state: 'PR', status: 'disponivel', featured: false, views: 134
    });

    console.log('✅ Veículos criados!');

    // Criar imagens
    await PropertyImage.create({ propertyId: prop1.id, url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80', caption: 'Fachada Principal', order: 1, isFeatured: true });
    await VehicleImage.create({ vehicleId: veh1.id, url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80', caption: 'Vista Lateral', order: 1, isFeatured: true });

    console.log('✅ Imagens criadas!');

    // Criar favoritos
    await Favorite.create({ userId: user1.id, propertyId: prop1.id, itemType: 'property' });
    await Favorite.create({ userId: user2.id, vehicleId: veh1.id, itemType: 'vehicle' });

    console.log('✅ Favoritos criados!');

    // Criar leads
    await Lead.create({
      propertyId: prop1.id, sellerId: seller1.id, buyerId: user1.id,
      name: 'João Silva', email: 'joao@email.com', phone: '(11) 99999-1111',
      status: 'visita_agendada', notes: 'Cliente muito interessado, pretende visitar no fim de semana.', source: 'website'
    });

    await Lead.create({
      vehicleId: veh1.id, sellerId: seller2.id, buyerId: user2.id,
      name: 'Maria Oliveira', email: 'maria@email.com', phone: '(11) 99999-2222',
      status: 'negociando', notes: 'Negociando valor da BMW, possível desconto.', source: 'phone'
    });

    console.log('✅ Leads criados!');

    // Criar reviews
    await Review.create({
      reviewerId: user1.id, sellerId: seller1.id, propertyId: prop1.id, rating: 5,
      title: 'Excelente profissional!', comment: 'Carlos foi muito atencioso e profissional durante todo o processo. Recomendo!', isVerified: true
    });

    console.log('✅ Reviews criados!');

    console.log('\\n🎉 Seed concluído com sucesso!\\n');
    console.log('📋 Usuários de teste:');
    console.log('  Admin: admin@primevenda.com / 123456');
    console.log('  Carlos (Vendedor): carlos@primevenda.com / 123456');
    console.log('  Ana (Vendedor): ana@primevenda.com / 123456');
    console.log('  Roberto (Vendedor): roberto@primevenda.com / 123456');
    console.log('  João (Usuário): joao@email.com / 123456');
    console.log('  Maria (Usuário): maria@email.com / 123456\\n');

  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error.message);
  }
};

module.exports = seedDB;
