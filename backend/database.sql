-- ======================
-- CRIAR BANCO
-- ======================
CREATE DATABASE IF NOT EXISTS meu_projeto_db;
USE meu_projeto_db;

-- ======================
-- USERS
-- ======================
CREATE TABLE IF NOT EXISTS Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'vendedor', 'user') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================
-- VEHICLES (ANTES DE VISITS)
-- ======================
CREATE TABLE IF NOT EXISTS Vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description LONGTEXT,
  category ENUM('Carro','Moto','Caminhão','Van') DEFAULT 'Carro',
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INT NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  mileage INT,
  fuel_type ENUM('Gasolina','Diesel','Elétrico','Híbrido') DEFAULT 'Gasolina',
  transmission ENUM('Manual','Automático') DEFAULT 'Manual',
  color VARCHAR(50),
  city VARCHAR(100),
  state VARCHAR(50),
  seller_id INT NOT NULL,
  status ENUM('disponivel','negociando','vendido','arquivado') DEFAULT 'disponivel',
  featured BOOLEAN DEFAULT FALSE,
  featured_image VARCHAR(500),
  views INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================
-- PROPERTIES
-- ======================
CREATE TABLE IF NOT EXISTS Properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description LONGTEXT,
  category ENUM('Casa','Apartamento','Cobertura','Terreno','Comercial','Galpão') DEFAULT 'Casa',
  price DECIMAL(15,2) NOT NULL,
  beds INT DEFAULT 0,
  baths INT DEFAULT 0,
  area DECIMAL(10,2),
  street VARCHAR(200) NOT NULL,
  number VARCHAR(20) NOT NULL,
  complement VARCHAR(150),
  neighborhood VARCHAR(100) NOT NULL,
  city VARCHAR(100),
  state VARCHAR(50),
  zipCode VARCHAR(10),
  seller_id INT NOT NULL,
  status ENUM('disponivel','negociando','vendido','arquivado') DEFAULT 'disponivel',
  featured BOOLEAN DEFAULT FALSE,
  featured_image VARCHAR(500),
  views INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================
-- LEADS
-- ======================
CREATE TABLE IF NOT EXISTS Leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  buyer_id INT,
  name VARCHAR(100),
  email VARCHAR(150),
  phone VARCHAR(20),
  status ENUM('novo','contato_feito','visita_marcada','proposta','fechado') DEFAULT 'novo',
  notes LONGTEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES Properties(id) ON DELETE CASCADE,
  FOREIGN KEY (buyer_id) REFERENCES Users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================
-- VISITS
-- ======================
CREATE TABLE IF NOT EXISTS Visits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  vehicle_id INT,
  lead_id INT NOT NULL,
  buyer_id INT NOT NULL,
  seller_id INT NOT NULL,
  scheduled_date DATETIME NOT NULL,
  status ENUM('agendada','realizada','cancelada') DEFAULT 'agendada',
  notes LONGTEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES Properties(id) ON DELETE CASCADE,
  FOREIGN KEY (vehicle_id) REFERENCES Vehicles(id) ON DELETE CASCADE,
  FOREIGN KEY (lead_id) REFERENCES Leads(id) ON DELETE CASCADE,
  FOREIGN KEY (buyer_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (seller_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================
-- FAVORITES
-- ======================
CREATE TABLE IF NOT EXISTS Favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  property_id INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES Properties(id) ON DELETE CASCADE,
  UNIQUE KEY unique_favorite (user_id, property_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================
-- MESSAGES
-- ======================
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
  FOREIGN KEY (property_id) REFERENCES Properties(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================
-- REVIEWS
-- ======================
CREATE TABLE IF NOT EXISTS Reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reviewer_id INT NOT NULL,
  seller_id INT NOT NULL,
  property_id INT,
  vehicle_id INT,
  rating INT NOT NULL,
  comment LONGTEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (reviewer_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (seller_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES Properties(id) ON DELETE SET NULL,
  FOREIGN KEY (vehicle_id) REFERENCES Vehicles(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================
-- TRANSACTIONS
-- ======================
CREATE TABLE IF NOT EXISTS Transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  buyer_id INT NOT NULL,
  seller_id INT NOT NULL,
  property_id INT,
  vehicle_id INT,
  amount DECIMAL(15,2) NOT NULL,
  status ENUM('pendente','concluida','cancelada') DEFAULT 'pendente',
  payment_method VARCHAR(50),
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (seller_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES Properties(id) ON DELETE SET NULL,
  FOREIGN KEY (vehicle_id) REFERENCES Vehicles(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================
-- NOTIFICATIONS
-- ======================
CREATE TABLE IF NOT EXISTS Notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  message LONGTEXT NOT NULL,
  type ENUM('info','warning','success','error') DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;