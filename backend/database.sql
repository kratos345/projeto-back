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

-- Inserir usuário admin padrão (senha: 123456)
INSERT INTO Users (name, email, password, role) VALUES 
('Admin', 'admin@example.com', '123456', 'admin')
ON DUPLICATE KEY UPDATE name='Admin';

-- Inserir usuário vendedor de exemplo (senha: 123456)
INSERT INTO Users (name, email, password, role) VALUES 
('Vendedor', 'vendedor@example.com', '123456', 'vendedor')
ON DUPLICATE KEY UPDATE name='Vendedor';

-- Inserir usuário comum de exemplo (senha: 123456)
INSERT INTO Users (name, email, password, role) VALUES 
('Usuario', 'usuario@example.com', '123456', 'user')
ON DUPLICATE KEY UPDATE name='Usuario';

-- Verificar tabela criada
SELECT * FROM Users;
