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
