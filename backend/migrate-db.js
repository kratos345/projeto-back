const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrateDatabase() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'meu_projeto_db'
    });

    console.log('🔄 Iniciando migração do banco de dados...');

    // Verificar se as tabelas existem
    const [tables] = await connection.execute("SHOW TABLES");
    const tableNames = tables.map(t => Object.values(t)[0]);

    if (!tableNames.includes('Users')) {
      console.log('❌ Tabela Users não encontrada. Execute o database.sql primeiro.');
      return;
    }

    console.log('✅ Verificando estrutura das tabelas...');

    // Migrar tabela Users - adicionar campos faltantes
    console.log('🔄 Migrando tabela Users...');
    try {
      await connection.execute(`
        ALTER TABLE Users
        ADD COLUMN IF NOT EXISTS phone VARCHAR(20) NULL,
        ADD COLUMN IF NOT EXISTS cpfCnpj VARCHAR(20) NULL UNIQUE,
        ADD COLUMN IF NOT EXISTS company VARCHAR(200) NULL,
        ADD COLUMN IF NOT EXISTS creci VARCHAR(50) NULL,
        ADD COLUMN IF NOT EXISTS website VARCHAR(200) NULL,
        ADD COLUMN IF NOT EXISTS profileImage TEXT NULL,
        ADD COLUMN IF NOT EXISTS status ENUM('ativo', 'inativo', 'bloqueado') DEFAULT 'ativo'
      `);
      console.log('✅ Tabela Users migrada');
    } catch (error) {
      console.log('⚠️  Erro ao migrar Users (pode já estar migrada):', error.message);
    }

    // Migrar tabela Properties - corrigir campos
    console.log('🔄 Migrando tabela Properties...');
    try {
      // Renomear category para type se necessário
      const [columns] = await connection.execute("SHOW COLUMNS FROM Properties");
      const columnNames = columns.map(c => c.Field);

      if (columnNames.includes('category') && !columnNames.includes('type')) {
        await connection.execute("ALTER TABLE Properties CHANGE category type ENUM('Casa', 'Apartamento', 'Cobertura', 'Terreno', 'Comercial', 'Galpão') DEFAULT 'Casa'");
      }

      // Adicionar campos faltantes
      await connection.execute(`
        ALTER TABLE Properties
        ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8) NULL,
        ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8) NULL,
        ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS views INT DEFAULT 0,
        MODIFY COLUMN status ENUM('disponivel', 'negociando', 'vendido', 'arquivado', 'pendente', 'ativo') DEFAULT 'disponivel'
      `);
      console.log('✅ Tabela Properties migrada');
    } catch (error) {
      console.log('⚠️  Erro ao migrar Properties:', error.message);
    }

    // Migrar tabela Leads - corrigir campos
    console.log('🔄 Migrando tabela Leads...');
    try {
      await connection.execute(`
        ALTER TABLE Leads
        ADD COLUMN IF NOT EXISTS vehicleId INT NULL,
        ADD COLUMN IF NOT EXISTS sellerId INT NOT NULL DEFAULT 1,
        ADD COLUMN IF NOT EXISTS source ENUM('website', 'app', 'phone', 'whatsapp', 'email') DEFAULT 'website',
        MODIFY COLUMN status ENUM('novo', 'contatado', 'visita_agendada', 'proposta_enviada', 'negociando', 'fechado', 'perdido') DEFAULT 'novo',
        ADD CONSTRAINT fk_lead_vehicle FOREIGN KEY (vehicleId) REFERENCES Vehicles(id) ON DELETE SET NULL,
        ADD CONSTRAINT fk_lead_seller FOREIGN KEY (sellerId) REFERENCES Users(id) ON DELETE CASCADE
      `);
      console.log('✅ Tabela Leads migrada');
    } catch (error) {
      console.log('⚠️  Erro ao migrar Leads:', error.message);
    }

    // Migrar tabela Favorites - corrigir campos
    console.log('🔄 Migrando tabela Favorites...');
    try {
      await connection.execute(`
        ALTER TABLE Favorites
        CHANGE user_id userId INT NOT NULL,
        CHANGE property_id propertyId INT NOT NULL,
        ADD COLUMN IF NOT EXISTS updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      `);
      console.log('✅ Tabela Favorites migrada');
    } catch (error) {
      console.log('⚠️  Erro ao migrar Favorites:', error.message);
    }

    // Criar tabelas faltantes se não existirem
    if (!tableNames.includes('Vehicles')) {
      console.log('🔄 Criando tabela Vehicles...');
      await connection.execute(`
        CREATE TABLE Vehicles (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(250) NOT NULL,
          description TEXT NULL,
          type ENUM('SUV', 'Sedan', 'Hatch', 'Pickup', 'Esportivo', 'Van', 'Moto') DEFAULT 'SUV',
          brand VARCHAR(100) NOT NULL,
          model VARCHAR(100) NOT NULL,
          year INT NOT NULL,
          price DECIMAL(15, 2) NOT NULL,
          mileage INT NULL,
          fuelType ENUM('Gasolina', 'Diesel', 'Elétrico', 'Híbrido') DEFAULT 'Gasolina',
          transmission ENUM('Manual', 'Automático') DEFAULT 'Manual',
          color VARCHAR(50) NULL,
          city VARCHAR(100) NOT NULL,
          state VARCHAR(2) NOT NULL,
          zipCode VARCHAR(20) NULL,
          sellerId INT NOT NULL,
          status ENUM('disponivel', 'negociando', 'vendido', 'arquivado', 'pendente', 'ativo') DEFAULT 'disponivel',
          featured BOOLEAN DEFAULT FALSE,
          views INT DEFAULT 0,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (sellerId) REFERENCES Users(id) ON DELETE CASCADE,
          INDEX idx_seller (sellerId),
          INDEX idx_city (city),
          INDEX idx_status (status),
          INDEX idx_featured (featured)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      console.log('✅ Tabela Vehicles criada');
    }

    if (!tableNames.includes('PropertyImages')) {
      console.log('🔄 Criando tabela PropertyImages...');
      await connection.execute(`
        CREATE TABLE PropertyImages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          propertyId INT NOT NULL,
          imageUrl VARCHAR(500) NOT NULL,
          isPrimary BOOLEAN DEFAULT FALSE,
          sortOrder INT DEFAULT 0,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (propertyId) REFERENCES Properties(id) ON DELETE CASCADE,
          INDEX idx_property (propertyId)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      console.log('✅ Tabela PropertyImages criada');
    }

    if (!tableNames.includes('VehicleImages')) {
      console.log('🔄 Criando tabela VehicleImages...');
      await connection.execute(`
        CREATE TABLE VehicleImages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          vehicleId INT NOT NULL,
          imageUrl VARCHAR(500) NOT NULL,
          isPrimary BOOLEAN DEFAULT FALSE,
          sortOrder INT DEFAULT 0,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (vehicleId) REFERENCES Vehicles(id) ON DELETE CASCADE,
          INDEX idx_vehicle (vehicleId)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      console.log('✅ Tabela VehicleImages criada');
    }

    console.log('🎉 Migração concluída com sucesso!');
    console.log('📝 Você pode executar o seed novamente se necessário.');

  } catch (error) {
    console.error('❌ Erro na migração:', error);
  } finally {
    if (connection) await connection.end();
  }
}

migrateDatabase();