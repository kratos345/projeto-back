-- Script para criar o banco de dados e tabelas
-- Execute este arquivo no seu MySQL antes de rodar a aplicação

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS meu_projeto_db;
USE meu_projeto_db;

-- Criar tabela Users
CREATE TABLE IF NOT EXISTS Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'vendedor', 'user') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Criar índice para email (melhor performance)
CREATE INDEX idx_email ON Users(email);

-- Criar tabela Properties (Imóveis)
CREATE TABLE IF NOT EXISTS Properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description LONGTEXT,
  type ENUM('casa', 'apartamento', 'terreno', 'comercial') DEFAULT 'apartamento',
  price DECIMAL(15, 2) NOT NULL,
  bedrooms INT DEFAULT 0,
  bathrooms INT DEFAULT 0,
  area DECIMAL(10, 2),
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  zipCode VARCHAR(10),
  seller_id INT NOT NULL,
  status ENUM('ativo', 'vendido', 'pendente') DEFAULT 'pendente',
  featured_image VARCHAR(500),
  views INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES Users(id) ON DELETE CASCADE,
  INDEX idx_seller (seller_id),
  INDEX idx_city (city),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Criar tabela Leads (Interessados)
CREATE TABLE IF NOT EXISTS Leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  buyer_id INT,
  name VARCHAR(100),
  email VARCHAR(150),
  phone VARCHAR(20),
  status ENUM('novo', 'contato_feito', 'visita_marcada', 'proposta', 'fechado') DEFAULT 'novo',
  notes LONGTEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES Properties(id) ON DELETE CASCADE,
  FOREIGN KEY (buyer_id) REFERENCES Users(id) ON DELETE SET NULL,
  INDEX idx_property (property_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Criar tabela Favorites (Imóveis Favoritos)
CREATE TABLE IF NOT EXISTS Favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  property_id INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES Properties(id) ON DELETE CASCADE,
  UNIQUE KEY unique_favorite (user_id, property_id),
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Criar tabela Visits (Visitas Agendadas)
CREATE TABLE IF NOT EXISTS Visits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  lead_id INT,
  scheduled_date DATETIME,
  status ENUM('agendada', 'realizada', 'cancelada') DEFAULT 'agendada',
  notes LONGTEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES Properties(id) ON DELETE CASCADE,
  FOREIGN KEY (lead_id) REFERENCES Leads(id) ON DELETE SET NULL,
  INDEX idx_scheduled (scheduled_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Criar tabela Messages (Chat/Mensagens)
CREATE TABLE IF NOT EXISTS Messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  property_id INT,
  message LONGTEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES Properties(id) ON DELETE SET NULL,
  INDEX idx_receiver (receiver_id),
  INDEX idx_created (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
