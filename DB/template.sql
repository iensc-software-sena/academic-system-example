-- Create the data base
CREATE DATABASE IF NOT EXISTS academic_system_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

-- Use the created data base
USE academic_system_db;

-- Create the Users table
CREATE TABLE IF NOT EXISTS Users (
    id INT PRIMARY KEY,
    userName VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    address VARCHAR(255),
    registrationNumber VARCHAR(50) UNIQUE,
    program VARCHAR(100),
    firstName VARCHAR(50) NOT NULL,
    middleName VARCHAR(50),
    firstLastName VARCHAR(50) NOT NULL,
    secondLastName VARCHAR(50),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO Users (
  id,
  userName,
  password,
  role,
  email,
  phone,
  address,
  registrationNumber,
  program,
  firstName,
  middleName,
  firstLastName,
  secondLastName
) VALUES
(1037657437, 'admin', '$$2a$11$8I0CpxzUm9IZmyBD9Q.tt.HtPtxE56lx2pPxZrhv6.J.7ZuxBhs..', 'administrador', 'admin01@iensch.edu.co', '+573001112233', 'Calle 10 #23-45', 'REG001', 'Ingeniería de Sistemas', 'Carlos', 'Andrés', 'Pérez', 'Gómez');


SELECT * FROM Users;
