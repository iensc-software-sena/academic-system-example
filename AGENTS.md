# AGENTS.md

Guía para cualquier agente o modelo de IA que implemente código en este proyecto (`academic-system-example`).
Objetivo: cuando se pida un nuevo servicio, controlador, router o vista, el resultado debe ser **indistinguible del código existente**. Antes de escribir, lee un ejemplo real (`src/services/userServices.js`, `src/controllers/users/*.js`, `src/routes/userRouter.js`) y replica el patrón.

---

## 1. Stack y reglas generales

- **Runtime:** Node.js con **ES Modules** (`"type": "module"` en `package.json`). Usa `import` / `export`, nunca `require` ni `module.exports`.
- **Framework:** Express 4. **Vistas:** EJS. **BD:** MySQL 8 con `mysql2/promise` (pool). **Auth:** JWT (`jsonwebtoken`) en cookie `httpOnly` + `bcryptjs`. **Errores:** `@hapi/boom`.
- **Toda importación local lleva la extensión `.js`** (ej. `'../services/userServices.js'`).
- No agregues dependencias nuevas sin que se pida explícitamente. No introduzcas ORMs (Sequelize, Prisma, etc.), TypeScript, ni frameworks de frontend.
- **Idioma:**
  - Identificadores de código, nombres de archivos, comentarios y mensajes JSON de la API: **inglés**.
  - Textos visibles al usuario en vistas EJS y mensajes de error renderizados (`authError`): **español**.

## 2. Estilo de código (`.editorconfig` + `.eslintrc.json`)

- Indentación de **2 espacios**, saltos de línea `LF`, `UTF-8`, línea final en blanco.
- **Comillas simples** y **punto y coma siempre** (`semi: always`, `quotes: single`).
- `const` por defecto; `let` solo si se reasigna; nunca `var`.
- Funciones flecha para controladores, middlewares y utilidades; `class` con métodos `async` para servicios.
- `async/await` con `try/catch`. No uses `.then()` encadenado salvo que envuelvas una API basada en callbacks.
- **Comentarios en inglés, sobre la línea que explican**, con estilo didáctico (este proyecto se usa para enseñar): comenta cada import, cada bloque lógico y cada decisión no obvia. Ejemplo: `// Import Boom for handling HTTP-friendly error objects`.
- Evita `console.log` salvo en arranque/diagnóstico (`no-console: warn`).

## 3. Estructura de carpetas

```
src/
  app.js                     # Bootstrap de Express: middlewares globales, estáticos, vistas, routers, errores
  config/config.js           # ÚNICO lugar donde se lee process.env
  DB/index.js                # Pool de conexiones mysql2 (export const pool)
  libraries/                 # Utilidades de infraestructura (DBConnection, netConfig)
  routes/
    index.js                 # Registra todos los routers bajo /app/v1
    UIRouter.js              # Rutas GET que renderizan vistas
    <entity>Router.js        # Un router por entidad (ej. userRouter.js)
  controllers/
    UI/<view>.js             # Un controlador por vista (render)
    <entities>/<action>.js   # Un archivo por acción (create.js, delete.js, listAll.js...)
  services/<entity>Services.js  # Lógica de negocio + acceso a BD (una clase por entidad)
  middlewares/
    errorHandler.js          # logError, boomErrorHandler, errorHandler
    tokenHandlers/           # Middlewares de autenticación
  utils/auth/                # Hash, firma y verificación de tokens, estrategia passport
  views/<view>.ejs           # Plantillas EJS
  public/
    styles/<view>.css        # Un CSS por vista
    js/<view>.js             # JS de cliente (fetch, validaciones, redirecciones)
```

**Flujo de una petición:** `Router → (middleware auth) → Controller → Service → pool (SQL)`, y los errores viajan con `next(err)` hacia `logError → boomErrorHandler → errorHandler`.

## 4. Responsabilidad de cada capa (no mezclar)

| Capa | Hace | NO hace |
|---|---|---|
| **Router** | Declara método, path y encadena middleware + controlador | Lógica, SQL, validaciones |
| **Controller** | Lee `req.body`/`req.user`, valida presencia de datos, llama al servicio, arma la respuesta HTTP, traduce errores a Boom | SQL, hashing, reglas de negocio |
| **Service** | Reglas de negocio, SQL parametrizado, hashing, firma de tokens; lanza errores Boom; retorna objetos `{ status: '...' }` o datos | Tocar `req`/`res`, decidir códigos HTTP de éxito |
| **Middleware** | Autenticación/renovación de token, manejo de errores | Lógica de negocio |
| **config** | Leer variables de entorno | Nada más |

## 5. Nomenclatura

| Elemento | Convención | Ejemplos |
|---|---|---|
| Archivos JS | `camelCase.js` | `userServices.js`, `tokenSign.js`, `listAll.js` |
| Routers (archivo y export) | `<entity>Router` | `userRouter.js` → `export const userRouter` |
| Clase de servicio | `PascalCase` + `Services` | `UserServices` |
| Métodos de servicio | `camelCase` verbo corto | `login`, `createOne`, `updateOne`, `updatePassword`, `deleteOne`, `listOne`, `listAll` |
| Controladores | `camelCase`, verbo + `One`/`All` + Entidad (singular/plural) | `createOneUser`, `updateOneUser`, `deleteOneUser`, `listOneUser`, `listAllUsers`, `loginUser` |
| Archivo de controlador | Nombre de la acción | `create.js`, `update.js`, `delete.js`, `listOne.js`, `listAll.js` |
| Controladores de vista | Nombre de la vista | `dashboard`, `profile`, `loginForm` |
| Instancia del servicio | `<entity>Manager` | `const userManager = new UserServices();` |
| Variables / propiedades | `camelCase` | `userName`, `firstLastName`, `registrationNumber` |
| Variables de entorno | `UPPER_SNAKE_CASE` → propiedad `camelCase` en `config` | `AUTH_APP_JWT_SECRET_KEY` → `config.authAppJwtKey` |
| Tablas SQL | `PascalCase` plural | `Users` |
| Columnas SQL | `camelCase` (igual que las propiedades JS) | `userName`, `createdAt` |
| Estados de retorno del servicio | `'UPPER CASE WITH SPACES'` para éxito de escritura | `'CREATED SUCCESSFULLY'`, `'UPDATED SUCCESSFULLY'`, `'DELETED SUCCESSFULLY'`, `'PASSWORD UPDATED SUCCESSFULLY'` |
| Estados de login | `'lowercase words'` | `'user not found'`, `'wrong password'`, `'logged'` |
| Vistas / CSS / JS cliente | Mismo nombre base por vista | `profile.ejs`, `profile.css` |

## 6. Configuración y variables de entorno

- Nunca uses `process.env` fuera de `src/config/config.js`. Si necesitas una variable nueva:
  1. Añádela al objeto `config` con comentario en inglés y nombre `camelCase`.
  2. Impórtala donde se necesite: `import { config } from '../config/config.js';`
- Variables actuales: `APP_PORT`, `DB_USER`, `DB_USER_PASSWORD`, `DB_HOST`, `DB_NAME`, `DB_PORT`, `AUTH_APP_JWT_SECRET_KEY`.
- Nunca escribas secretos ni credenciales en el código.

## 7. Base de datos

- Usa siempre el pool: `import { pool } from '../DB/index.js';` y `pool.query(sql, [params])`.
- **Siempre consultas parametrizadas con `?`**. Jamás concatenes valores en el SQL.
- Desestructura el resultado: `const [rows] = await pool.query(...)`; para escrituras `const [result] = ...` y valida `result.affectedRows`.
- Nunca devuelvas el hash de contraseña: en `listOne` se hace `delete theUser.password`, en `listAll` se enumeran columnas explícitas (sin `SELECT *`). Sigue ese criterio en toda consulta de lectura nueva.
- Cuando agregues una tabla, documenta su `CREATE TABLE` en el `README.md` (mismo formato que `Users`: `IF NOT EXISTS`, `createdAt` y `updatedAt` con `TIMESTAMP`).

## 8. Plantilla de SERVICIO

Archivo: `src/services/<entity>Services.js`. Una clase por entidad, métodos `async`, sin `req`/`res`.

```js
// import the data base pool of connections
import { pool } from '../DB/index.js';
// boom allows managing possible errors
import Boom from '@hapi/boom';

// create the <entity> services class
export class CourseServices {

  async createOne(newCourse) {
    try {
      // searches the database if there is a course with this code
      const [rows] = await pool.query(
        'SELECT * FROM Courses WHERE code = ?',
        [newCourse.code]
      );

      // if the course exists, reject the insertion
      if (rows.length > 0) {
        throw Boom.conflict('Course code already exists');
      }

      // create a new record in the database
      await pool.query(
        'INSERT INTO Courses (code, name) VALUES (?, ?)',
        [newCourse.code, newCourse.name]
      );

      // return a success response
      return { status: 'CREATED SUCCESSFULLY' };
    } catch (err) {
      // Return a Boom error if there's an exception
      throw Boom.boomify(err, {
        message: 'Unable to create new course',
      });
    }
  }

  async listOne(id) {
    // return an error response
    if (!id) {
      throw Boom.badRequest('No course ID provided');
    }

    try {
      const [rows] = await pool.query(
        'SELECT * FROM Courses WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        // return an error response
        throw Boom.notFound('Course not found');
      }

      return rows[0];
    } catch (err) {
      // return a Boom error if there's an exception finding the course
      throw Boom.boomify(err, {
        message: 'Unable to find course',
      });
    }
  }
}
```

Reglas del servicio:
- Valida argumentos obligatorios **antes** del `try` y lanza `Boom.badRequest(...)`.
- Usa `Boom.notFound`, `Boom.conflict`, `Boom.badRequest` para errores esperados; envuelve el resto con `Boom.boomify(err, { message })` en el `catch`.
- Escrituras retornan `{ status: 'XXX SUCCESSFULLY' }`; lecturas retornan el dato (objeto o arreglo; `listAll` retorna `[]` si no hay filas).
- Contraseñas: `hashPassword` (`utils/auth/passwordHash.js`) al guardar, `bcrypt.compare` al validar. Tokens: `signUserToken(payload, config.authAppJwtKey, '1h')`.
- Nombres de métodos del CRUD: `createOne`, `updateOne`, `deleteOne`, `listOne`, `listAll`.

## 9. Plantilla de CONTROLADOR

Archivo: `src/controllers/<entities>/<action>.js`. **Un archivo = una función exportada.**

```js
// Import the CourseServices class from the courseServices module
import { CourseServices } from '../../services/courseServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

export const listOneCourse = async (req, res, next) => {

  // Destructure the course ID from the request body
  const { id } = req.body;

  // Validate if the course ID is sent.
  if (!id) {
    return next(Boom.badRequest('Course ID is required for the search'));
  }

  // Instantiate the CourseServices class to manage course operations
  const courseManager = new CourseServices();

  try {
    // Attempt to find the course record by ID
    const record = await courseManager.listOne(id);

    // If the record is found, send a success response with the data
    return res.status(200).json({
      success: true,
      message: 'Course found successfully',
      // Include the new token in the response
      authentication: res.locals.newUserToken,
      course: record
    });

  } catch (err) {
    // Let Boom errors thrown by the service pass through untouched
    if (Boom.isBoom(err)) {
      return next(err);
    }
    // Handle unexpected errors by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve the course from the database',
      err
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};
```

Reglas del controlador:
- Firma siempre `(req, res, next)`.
- Valida la presencia de datos del body y responde con `return next(Boom.badRequest('...'))`.
- Instancia el servicio dentro del controlador: `const <entity>Manager = new <Entity>Services();`.
- **Formato de respuesta JSON estándar:** `{ success: boolean, message: string, authentication: res.locals.newUserToken, <data> }`. Códigos: `200` lectura/actualización/eliminación, `201` creación (y cambio de contraseña), `404` no encontrado.
- Dentro del `catch`: primero `if (Boom.isBoom(err)) return next(err);`, luego envolver con `Boom.serverUnavailable('Unable to ... ', err)` (o `Boom.badImplementation` / `Boom.notImplemented` en vistas) y `next(boomError)`. **Nunca** hagas `res.status(500).json(...)` directo.
- Los datos del usuario autenticado se leen de `req.user` (lo asigna el middleware), p. ej. `const { id } = req.user;`.
- Payloads de entrada: se envuelven en un objeto con nombre (`{ newUserData }`, `{ credentials }`, `{ id, newUserData }`). Mantén ese patrón para datos nuevos (`{ newCourseData }`).

### Controladores de vista (`controllers/UI/`)

```js
export const profile = async (req, res, next) => {
  const userManager = new UserServices();
  try {
    // Extract the user id that the middleware saved in req.user
    const { id } = req.user;
    const userData = await userManager.listOne(id);
    // Return rendering the template and send the user data object
    res.render('profile', { userData: userData });
  } catch (err) {
    const boomError = Boom.notImplemented(
      'No es posible renderizar la vista de perfil de usuario.',
      err);
    next(boomError);
  }
};
```

## 10. Plantilla de ROUTER y registro

Archivo: `src/routes/<entity>Router.js`. Cada ruta lleva **un comentario por argumento** (path, middleware, controlador).

```js
// Import the Router class from Express
import { Router } from "express";
// Import the middleware to verify tokens from the authentication app
import { authAppVerifyToken } from
'../middlewares/tokenHandlers/authAppTokenHandler.js';
// Import the controllers functions to manage courses
import { createOneCourse } from '../controllers/courses/create.js';
import { listOneCourse } from '../controllers/courses/listOne.js';

// Create a new Router instance
export const courseRouter = Router();

// Define a POST route to create a course
courseRouter.post(
  // Route path to create a course
  '/create',
  // Middleware to verify the token before proceeding to the controller
  authAppVerifyToken,
  // Controller function to create the course
  createOneCourse
);

// Define a POST route to list a course
courseRouter.post(
  // Route path to list a course
  '/listone',
  authAppVerifyToken,
  // Controller function to list a course
  listOneCourse
);
```

Registro obligatorio en `src/routes/index.js`:

```js
// Import the courseRouter for handling course-related routes
import { courseRouter } from "./courseRouter.js";
// ...
// Use the courseRouter for handling '/courses' routes under '/app/v1'
router.use('/courses', courseRouter);
```

Convenciones de rutas:
- Prefijo global: **`/app/v1`**; recurso en plural: `/app/v1/courses/...`.
- Sufijos de acción en minúscula, sin guiones: `/create`, `/update`, `/delete`, `/listone`, `/listall`, `/password`, `/login`.
- **`POST`** para todo lo que recibe body (crear, actualizar, eliminar, listar uno); **`GET`** solo para `listall` y vistas.
- Toda ruta que no sea de acceso público (login y registro) lleva `authAppVerifyToken`.
- Rutas de vistas (HTML) van en `UIRouter.js`, con `GET`, y las vistas protegidas también usan `authAppVerifyToken`.

## 11. Autenticación

- El token JWT viaja en la cookie **`authentication`** (`httpOnly: true`). Payload mínimo: `{ id }`. Expiración: `'1h'`.
- `authAppVerifyToken` valida la cookie, **renueva** el token, y asigna `req.user = decoded`. Los controladores nunca verifican el JWT por su cuenta (usa el middleware).
- Firma con `signUserToken`, verifica con `verifyToken`; no llames `jwt.sign`/`jwt.verify` nuevos en controladores o servicios sin necesidad.
- Contraseñas: `bcryptjs`, 11 rondas (`hashPassword`). Nunca almacenar ni devolver contraseñas en texto plano.

## 12. Manejo de errores

- Todo error debe terminar en `next(err)` para que lo procesen `logError → boomErrorHandler → errorHandler` (registrados al final de `app.js`).
- Errores de dominio: siempre objetos **Boom** (`Boom.badRequest`, `notFound`, `conflict`, `serverUnavailable`, `badImplementation`, `notImplemented`).
- Errores de autenticación en vistas: `res.status(401|403|404).render('authError', { message, type })` con `type` en `user | password | no-token | token-exp | token-inv` y `message` en español.

## 13. Vistas y frontend

- Plantillas en `src/views/<view>.ejs`, `lang="es"`, con `<link>` al CSS `/styles/<view>.css` y scripts desde `/js/`.
- **HTML + CSS + JavaScript vanilla.** Sin frameworks ni librerías de UI (solo Google Fonts / Font Awesome por CDN como ya se hace).
- CSS: un archivo por vista; reset `* { margin: 0; padding: 0; box-sizing: border-box; }`; `html { font-size: 62.5%; }` (1rem = 10px) y **medidas en `rem`**; colores en variables `:root` con la paleta existente (`--blue-light: #667eea`, `--purple: #764ba2`, `--gray: #464646`, `--dark-gray: #d7d7d7`, `--white`, `--red`, `--yellow`); fondo `linear-gradient(135deg, var(--blue-light), var(--purple))`; tarjetas blancas con `border-radius` y `box-shadow`; animación `fadeIn`; media queries para móvil.
- Clases en CSS: `kebab-case` (`.dashboard-card`, `.profile-header`, `.form-button`).
- JS de cliente (`public/js/`): funciones globales simples (`handleSubmit`, `handleRegister`, `redirect`), `fetch` a `/app/v1/...` con `Content-Type: application/json` y el mismo wrapper de body (`{ credentials }`, `{ newUserData }`); mostrar errores en un `<p id="wrong-input">`. Navegación con `data-path` + `onclick="redirect(this)"`.
- Para nuevas vistas: crea `controllers/UI/<view>.js`, `views/<view>.ejs`, `public/styles/<view>.css`, (opcional) `public/js/<view>.js` y registra la ruta `GET` en `UIRouter.js`.

## 14. Checklist para implementar una nueva entidad/funcionalidad

1. **SQL:** definir la tabla (PascalCase plural, columnas camelCase) y documentarla en `README.md`.
2. **Service:** `src/services/<entity>Services.js` con clase `<Entity>Services` y métodos `createOne/updateOne/deleteOne/listOne/listAll` (los que apliquen).
3. **Controllers:** `src/controllers/<entities>/<action>.js`, uno por acción, con el formato de respuesta estándar.
4. **Router:** `src/routes/<entity>Router.js` y registrarlo en `src/routes/index.js` bajo `/<entities>`.
5. **Auth:** proteger con `authAppVerifyToken` lo que no sea público.
6. **(Opcional) UI:** vista EJS + CSS + JS + controlador UI + ruta en `UIRouter.js`.
7. **Docs:** añadir cada endpoint nuevo a la sección "Uso de la aplicación" del `README.md` (método, endpoint, body JSON, respuesta), con el mismo formato.
8. Verificar: comillas simples, `;`, 2 espacios, imports con `.js`, comentarios en inglés, ninguna lectura de `process.env` fuera de `config.js`.

## 15. Inconsistencias conocidas (NO las repliques)

El código actual tiene detalles que no son el estándar deseado; al escribir código nuevo sigue la regla, no el desliz:

- Algunos archivos usan comillas dobles (`routes/index.js`, `userRouter.js`, `app.js`): el estándar es **comillas simples**.
- Faltan puntos y coma en algunos lugares (`password.js`, `update.js`, `authError` render): usa siempre `;`.
- `res.locals.newUserToken` no se asigna en ningún middleware (el middleware renueva el token en la cookie): mantener la clave `authentication` en las respuestas por consistencia, pero no asumir que trae valor.
- `utils/auth/authApp/tokenData.js` importa `../../config/config.js` (ruta incorrecta) y hay redundancia `express.json()` + `bodyParser.json()` en `app.js`: no copiar.
- La ruta `/users/create` tiene `authAppVerifyToken` comentado por ser registro público; no dejes middleware comentado en código nuevo, decide explícitamente si la ruta es pública o protegida.
- `password.js` no valida la presencia de `req.body.credentials` antes de desestructurar: valida siempre el body antes de usarlo.
- Textos con "sección" donde corresponde "sesión" (login/errores): en textos nuevos escribe "sesión".
- `docker-compose.yml` usa `DB_PASSWORD` mientras `config.js` lee `DB_USER_PASSWORD`: mantener ambas coherentes al tocar variables de entorno.
- Los imports de código suelto (`const passport = import(...)` en `app.js`) no deben replicarse; usa imports estáticos.

## 16. Qué NO hacer

- No poner SQL en controladores ni `req`/`res` en servicios.
- No crear un archivo de controlador con varias acciones ni un servicio con funciones sueltas (usa la clase).
- No responder errores con `res.status(...).json(...)` directo desde controladores/servicios; usa Boom + `next`.
- No cambiar la estructura de carpetas, el prefijo `/app/v1`, el formato de respuesta ni la paleta de estilos.
- No introducir TypeScript, ORMs, frameworks de frontend, ni convertir a CommonJS.
- No omitir los comentarios explicativos en inglés (el proyecto es material didáctico).
