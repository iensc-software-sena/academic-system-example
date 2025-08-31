-- Create the data base
CREATE DATABASE IF NOT EXISTS academic_system_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

-- Use the created data base
USE academic_system_db;

-- Create the Users table
CREATE TABLE IF NOT EXISTS Users (
    id INT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
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
  username,
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
(1037657437, 'admin01', '$2b$10$abcdef432fs3s21', 'administrador', 'admin01@iensch.edu.co', '+573001112233', 'Calle 10 #23-45', 'REG001', 'Ingeniería de Sistemas', 'Carlos', 'Andrés', 'Pérez', 'Gómez'),
(1034562125, 'user01', '$2b$10$abcdef5gd21ss2', 'estudiante', 'user01@iensch.edu.co', '+573004445566', 'Carrera 45 #12-34', 'REG002', 'Ingeniería Electrónica', 'María', 'Elena', 'Rodríguez', 'López'),
(1045673212, 'user02', '$2b$10$abcdef213sf32s', 'estudiante', 'user02@iensch.edu.co', '+573007778899', 'Av 6 Norte #55-66', 'REG003', 'Matemáticas', 'Juan', 'David', 'Martínez', 'Torres'),
(1056437218, 'prof01', '$2b$10$abcdef3r354s12', 'docente', 'prof01@iensch.edu.co', '+573001234567', 'Calle 50 #20-10', 'REG004', 'Física', 'Laura', 'Isabel', 'Fernández', 'Ruiz'),
(1056438213, 'user03', '$2b$10$abcdef2sd35d45', 'estudiante', 'user03@iensch.edu.co', '+573009998877', 'Carrera 100 #25-50', 'REG005', 'Ingeniería Mecánica', 'Andrés', 'Felipe', 'Morales', 'Castillo');
