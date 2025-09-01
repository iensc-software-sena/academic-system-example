# IENSC

---

### ejemplo sistema académico

Esta **aplicación web** implementa un sistema completo de gestión de usuarios con
operaciones **CRUD** sobre una **base de datos**. Además, incluye **funcionalidades** de **autenticación**, **gestión de sesiones**, un **dashboard interactivo** y un **módulo de perfil de usuario**.

El proyecto integra **estrategias de autenticación seguras**, garantizando la **protección** de las **credenciales** y el **acceso controlado** a las distintas secciones de la aplicación. Su **arquitectura** está pensada para ser **clara, escalable y fácil de mantener**, ofreciendo una **base sólida** para proyectos **académicos y profesionales**.

---

## ⚙️ funcionalidades

- **Gestión de Usuarios**
  - Registro de nuevos usuarios.
  - Autenticación mediante credenciales (login).
  - Cierre de sesión seguro.
  - Visualización y edición del perfil personal.

- **CRUD en la Base de Datos**
  - Creación de registros.
  - Lectura/consulta de información almacenada.
  - Actualización de registros existentes.
  - Eliminación de registros.

- **Autenticación y Seguridad**
  - Estrategias de autenticación seguras.
  - Manejo de sesiones con expiración.
  - Validación de datos de entrada.

- **Interfaz de Usuario**
  - Vista de autenticación (login y registro).
  - Dashboard con información general del usuario.
  - Sección de perfil con datos personales.

- **Arquitectura Escalable**
  - Separación entre frontend, backend y base de datos.
  - Código organizado siguiendo buenas prácticas de desarrollo.

---

## Tecnologías utilizadas

- **JavaScript**
- **Node.js**
- **Express.js**
- **Variables de entorno**
- **JWT**
- **Boom**
- **Bcrypt**
- **EJS**
- **HTML**
- **CSS**
- **EJS**
- **MySQL**
- **MySQLWorkbench**

---

## Empezando

> Siga estos sencillos pasos para poner en funcionamiento una copia local de este proyecto.

### Prerrequisitos

Asegúrese de tener lo siguiente instalado en su máquina:

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)
- [MySQLWorkbench](https://dev.mysql.com/downloads/workbench/)
- [Postman](https://www.postman.com/downloads/)

#### Extensiones de Visual Studio Code
- [editorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)


---

## Instalación

1. Clonar el repositorio:

```sh
git clone https://github.com/iensc-software-sena/academic-system-example.git
```

2. Diríjase al directorio del proyecto:

```sh
cd academic-system-example
```

3. Cree la base de datos en el motor de MySQL:

```SQL
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
```

4. Instale las dependencias de desarrollo necesarias para ejecutar el proyecto:

```sh
npm run dev-dep
```

5. Para iniciar el servidor de desarrollo y ejecutar el proyecto, utilice el siguiente comando:

```sh
npm run dev
```

---

## Uso de la aplicación

Por medio de la aplicación **Postman** se pueden probar las funcionalidades que entrega
la **API**, a través de los siguientes **EndPoints**:

### Autenticar un usuario
Método: **POST**
EndPoint: **/app/v1/users/login**
Body:
```JSON
{
    "credentials": {
        "userName": "andres0714",
        "password": "pass1234"
    }
}
```
Respuesta:
> Redireccionamiento a la vista de **Dashboard**

---

### Crear un nuevo usuario
Método: **POST**
EndPoint: **/app/v1/users/create**
Body:
```JSON
{
    "newUserData": {
        "id": 1036543782,
        "userName": "andres0714",
        "password": "pass1234",
        "role": "estudiante",
        "email": "andreslopez07@iensch.edu.co",
        "phone": "+57 314 564 2356",
        "address": "Calle 23 # 45 - 65",
        "registrationNumber": "20257654321",
        "program": "Ingeniería de sistemas",
        "firstName": "Andres",
        "middleName": "Felipe",
        "firstLastName": "Lopez",
        "secondLastName": "Morales"
    }
}
```
Respuesta:
```JSON
{
    "success": true,
    "message": "User created successfully"
}
```

---

### Listar un usuario especifico
Método: **POST**
EndPoint: **/app/v1/users/listone**
Body:
```JSON
{
    "id": 1036543782,
}
```
Respuesta:
```JSON
{
    "success": true,
    "message": "User found successfully",
    "user": {
        "id": 1036543782,
        "userName": "andres0714",
        "role": "estudiante",
        "email": "andreslopez07@iensch.edu.co",
        "phone": "+57 314 564 2356",
        "address": "Calle 23 # 45 - 65",
        "registrationNumber": "20257654321",
        "program": "Ingeniería de sistemas",
        "firstName": "Andres",
        "middleName": "Felipe",
        "firstLastName": "Lopez",
        "secondLastName": "Morales",
        "createdAt": "2025-08-31T23:34:58.000Z",
        "updatedAt": "2025-08-31T23:34:58.000Z"
    }
}
```

---

### Listar todos los usuarios
Método: **GET**
EndPoint: **/app/v1/users/listall**
Body:
> No se envía **ningún objeto JSON** solo el **token** de autenticación en la **Cookie**

Respuesta:
```JSON
{
    "success": true,
    "message": "Users retrieved successfully",
    "users": [
        {
            "id": 1036543782,
            "userName": "andres0714",
            "role": "estudiante",
            "email": "andreslopez07@iensch.edu.co",
            "phone": "+57 314 564 2356",
            "address": "Calle 23 # 45 - 65",
            "registrationNumber": "20257654321",
            "program": "Ingeniería de sistemas",
            "firstName": "Andres",
            "middleName": "Felipe",
            "firstLastName": "Lopez",
            "secondLastName": "Morales"
        },
        {
            "id": 1056432342,
            "userName": "laura0817",
            "role": "estudiante",
            "email": "lauragomez0817@iensch.edu.co",
            "phone": "+57 315 678 6543",
            "address": "Calle 43 # 62 - 12",
            "registrationNumber": "20257654332",
            "program": "Ingeniería de electrónica",
            "firstName": "Laura",
            "middleName": "Marcela",
            "firstLastName": "Gomez",
            "secondLastName": "Rivera"
        }
    ]
}
```

---

### Actualizar la contraseña de un usuario
Método: **POST**
EndPoint: **/app/v1/users/password**
Body:
```JSON
{
    "credentials": {
        "id": 1056432342,
        "userName": "laura0817",
        "email": "lauragomez0817@iensch.edu.co",
        "newPassword": "contraseña1234"
    }
}
```
Respuesta:
```JSON
{
    "success": true,
    "message": "Password updated successfully"
}
```

---
### Actualizar la información de un usuario
Método: **POST**
EndPoint: **/app/v1/users/update**
Body:
```JSON
{
    "id": 1056432342,
    "newUserData": {
        "userName": "Carlos1706",
        "role": "estudiante",
        "email": "carlosalzate1706@iensch.edu.co",
        "phone": "+57 316 789 0543",
        "address": "Calle 43 # 12 - 32",
        "registrationNumber": "20257653212",
        "program": "Ingeniería de mecatrónica",
        "firstName": "Carlos",
        "middleName": "Javier",
        "firstLastName": "Alzate",
        "secondLastName": "Prada"
    }
}
```
Respuesta:
```JSON
{
    "success": true,
    "message": "User updated successfully"
}
```

---

### Eliminar un usuario en especifico
Método: **POST**
EndPoint: **/app/v1/users/delete**
Body:
```JSON
{
    "id": 1056432342
}
```
Respuesta:
```JSON
{
    "success": true,
    "message": "User deleted successfully"
}
```

---

## Contribuciones

Las contribuciones hacen que la comunidad de código abierto sea un lugar increíble 
para aprender, inspirar y crear. Cualquier contribución que realices será muy apreciada.

1. Realice un fork del proyecto  
2. Cree una rama para su funcionalidad (`git checkout -b feature/AmazingFeature`)  
3. Realiza sus cambios y haga un commit (`git commit -m 'Agregar nueva funcionalidad increíble'`)  
4. Haga un push a la rama (`git push origin feature/AmazingFeature`)  
5. Abra un Pull Request

---
## Licencia

Distribuido bajo la Licencia MIT. Consulta el archivo `LICENSE` para más información.

---

## Contacto
LinkedIn - [cristianco9](https://www.linkedin.com/in/cristianco9/)

---

Enlace al proyecto: [Github]
(https://github.com/iensc-software-sena/academic-system-example)

---

Siéntase libre de modificar este proyecto según sus preferencias y de añadir cualquier información adicional que consideres útil para los usuarios y colaboradores.
