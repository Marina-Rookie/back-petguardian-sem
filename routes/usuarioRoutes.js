const express = require("express");
const   router = express.Router();
const usuarioController = require("../controllers/usuarioController.js");
const authMiddleware = require("../services/authMiddlewareService.js");
const upload = require('../utils/cloudinaryConfig.js').upload;
/**
 * @swagger
 * tags:
 *   name: Usuario
 *   description: API para gestionar usuarios
 */

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     description: Permite a un usuario iniciar sesión en el sistema.
 *     tags: [Usuario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: El correo electrónico del usuario
 *                 example: usuario@test.com
 *               password:
 *                 type: string
 *                 description: La contraseña del usuario
 *                 example: password123
 *     responses:
 *       '200':
 *         description: Usuario logueado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario logueado con exito
 *                 token:
 *                   type: string
 *                   description: Token de autenticación
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 rol:
 *                   type: string
 *                   description: Rol del usuario
 *                   example: Cliente
 *                 idUsuario:
 *                   type: string
 *                   description: ID del usuario
 *                   example: 60d5f360a3f8b0928c8b4567
*       '404':
*         description: No existe ningún usuario registrado con el correo electrónico proporcionado
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: No existe ningun usuario registrado con ese email
*       '400':
*         description: Error en la solicitud, por ejemplo, si la contraseña no coincide
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Error al iniciar sesión
*/
router.post("/login", usuarioController.login);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     description: Permite registrar un nuevo usuario en el sistema.
 *     tags: [Usuario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: El correo electrónico del usuario
 *                 example: usuario@test.com
 *               password:
 *                 type: string
 *                 description: La contraseña del usuario
 *                 example: password123
 *               nombre:
 *                 type: string
 *                 description: El nombre del usuario
 *                 example: Juan
 *               apellido:
 *                 type: string
 *                 description: El apellido del usuario
 *                 example: Perez
 *               cuidador:
 *                 type: boolean
 *                 description: Indica si el usuario es un cuidador
 *                 example: false
 *     responses:
 *       '201':
 *         description: Usuario registrado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario registrado con exito
 *                 token:
 *                   type: string
 *                   description: Token de autenticación
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 rol:
 *                   type: string
 *                   description: Rol del usuario
 *                   example: Cliente
 *                 idUsuario:
 *                   type: string
 *                   description: ID del usuario
 *                   example: 60d5f360a3f8b0928c8b4567
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al registrar el usuario
 */
router.post("/", usuarioController.createNewUser);

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Permite obtener una lista de todos los usuarios no eliminados.
 *     tags: [Usuario]
 *     responses:
 *       '200':
 *         description: Lista de usuarios obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID del usuario
 *                     example: 60d5f360a3f8b0928c8b4567
 *                   nombre:
 *                     type: string
 *                     description: Nombre del usuario
 *                     example: Juan
 *                   apellido:
 *                     type: string
 *                     description: Apellido del usuario
 *                     example: Perez
 *                   email:
 *                     type: string
 *                     description: Correo electrónico del usuario
 *                     example: usuario@test.com
 *                   telefono:
 *                     type: string
 *                     description: Teléfono del usuario
 *                     example: 123456789
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener los usuarios
 */
router.get("/", authMiddleware.verifyToken, usuarioController.getUsers);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     description: Permite eliminar (marcar como eliminado) un usuario en el sistema.
 *     tags: [Usuario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar
 *     responses:
 *       '200':
 *         description: Usuario eliminado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 n:
 *                   type: number
 *                   example: 1
 *                 nModified:
 *                   type: number
 *                   example: 1
 *                 ok:
 *                   type: number
 *                   example: 1
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al eliminar el usuario
 */
router.delete("/:id", authMiddleware.verifyToken, usuarioController.deleteUser);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Editar un usuario
 *     description: Permite editar la información de un usuario en el sistema.
 *     tags: [Usuario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: El correo electrónico del usuario
 *                 example: usuario@test.com
 *               nombre:
 *                 type: string
 *                 description: El nombre del usuario
 *                 example: Juan
 *               apellido:
 *                 type: string
 *                 description: El apellido del usuario
 *                 example: Perez
 *               telefono:
 *                 type: string
 *                 description: El teléfono del usuario
 *                 example: 123456789
 *               domicilio:
 *                 type: string
 *                 description: El domicilio del usuario
 *                 example: Calle Falsa 123
 *     responses:
 *       '200':
 *         description: Usuario editado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 n:
 *                   type: number
 *                   example: 1
 *                 nModified:
 *                   type: number
 *                   example: 1
 *                 ok:
 *                   type: number
 *                   example: 1
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al editar el usuario
 */
router.put("/:id", authMiddleware.verifyToken, usuarioController.editUser);

/**
 * @swagger
 * /api/usuarios/cuidadores-habilitados:
 *   get:
 *     summary: Obtener cuidadores habilitados
 *     description: Permite obtener una lista de todos los cuidadores habilitados no eliminados.
 *     tags: [Usuario]
 *     responses:
 *       '200':
 *         description: Lista de cuidadores habilitados obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID del usuario
 *                     example: 60d5f360a3f8b0928c8b4567
 *                   nombre:
 *                     type: string
 *                     description: Nombre del usuario
 *                     example: Juan
 *                   apellido:
 *                     type: string
 *                     description: Apellido del usuario
 *                     example: Perez
 *                   telefono:
 *                     type: string
 *                     description: Teléfono del usuario
 *                     example: 123456789
 *                   email:
 *                     type: string
 *                     description: Correo electrónico del usuario
 *                     example: usuario@test.com
 *                   descripcionPersonal:
 *                     type: string
 *                     description: Descripción personal del cuidador
 *                     example: Soy un cuidador con experiencia
 *                   tarifaHora:
 *                     type: number
 *                     description: Tarifa por hora del cuidador
 *                     example: 20
 *                   promedioPuntuacion:
 *                     type: number
 *                     description: Promedio de puntuación del cuidador
 *                     example: 4.5
 *                   imagenPerfil:
 *                     type: string
 *                     description: URL de la imagen de perfil del cuidador
 *                     example: https://example.com/imagen.jpg
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener los cuidadores habilitados
 */
router.get( "/cuidadores-habilitados/", authMiddleware.verifyToken, usuarioController.getCuidadoresHabilitados);

/**
 * @swagger
 * /cuidadores-pendientes:
 *   get:
 *     summary: Obtener cuidadores pendientes
 *     description: Permite obtener una lista de todos los cuidadores pendientes no eliminados.
 *     tags: [Usuario]
 *     responses:
 *       '200':
 *         description: Lista de cuidadores pendientes obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID del usuario
 *                     example: 60d5f360a3f8b0928c8b4567
 *                   nombre:
 *                     type: string
 *                     description: Nombre del usuario
 *                     example: Juan
 *                   apellido:
 *                     type: string
 *                     description: Apellido del usuario
 *                     example: Perez
 *                   telefono:
 *                     type: string
 *                     description: Teléfono del usuario
 *                     example: 123456789
 *                   email:
 *                     type: string
 *                     description: Correo electrónico del usuario
 *                     example: usuario@example.com
 *                   domicilio:
 *                     type: string
 *                     description: Domicilio del usuario
 *                     example: Calle Falsa 123
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener los cuidadores pendientes
 */
router.get( "/cuidadores-pendientes/", authMiddleware.verifyToken, authMiddleware.verifyAdmin, usuarioController.getCuidadoresPendientes);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Obtener un usuario
 *     description: Permite obtener la información de un usuario específico en el sistema.
 *     tags: [Usuario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a obtener
 *     responses:
 *       '200':
 *         description: Usuario obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID del usuario
 *                   example: 60d5f360a3f8b0928c8b4567
 *                 nombre:
 *                   type: string
 *                   description: Nombre del usuario
 *                   example: Juan
 *                 apellido:
 *                   type: string
 *                   description: Apellido del usuario
 *                   example: Perez
 *                 email:
 *                   type: string
 *                   description: Correo electrónico del usuario
 *                   example: usuario@example.com
 *                 telefono:
 *                   type: string
 *                   description: Teléfono del usuario
 *                   example: 123456789
 *                 domicilio:
 *                   type: string
 *                   description: Domicilio del usuario
 *                   example: Calle Falsa 123
 *                 rol:
 *                   type: string
 *                   description: Rol del usuario
 *                   example: Cliente
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener el usuario
 */
router.get("/:id", authMiddleware.verifyToken, usuarioController.getOneUser);

/**
 * @swagger
 * /clientes-con-reservas:
 *   get:
 *     summary: Obtener clientes con reservas por estado
 *     description: Permite obtener una lista de clientes con sus reservas filtradas por estado.
 *     tags: [Usuario]
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Nombre del cliente
 *       - in: query
 *         name: apellido
 *         schema:
 *           type: string
 *         description: Apellido del cliente
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Email del cliente
 *       - in: query
 *         name: reservasMin
 *         schema:
 *           type: integer
 *         description: Número mínimo de reservas
 *       - in: query
 *         name: reservasMax
 *         schema:
 *           type: integer
 *         description: Número máximo de reservas
 *     responses:
 *       '200':
 *         description: Lista de clientes con reservas obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 60d5f360a3f8b0928c8b4567
 *                       nombre:
 *                         type: string
 *                         example: Juan
 *                       apellido:
 *                         type: string
 *                         example: Perez
 *                       email:
 *                         type: string
 *                         example: usuario@test.com
 *                       telefono:
 *                         type: string
 *                         example: 123456789
 *                       reservasCanceladas:
 *                         type: integer
 *                         example: 2
 *                       reservasFinalizadas:
 *                         type: integer
 *                         example: 5
 *                       reservasAprobadas:
 *                         type: integer
 *                         example: 3
 *                       reservasPendientes:
 *                         type: integer
 *                         example: 1
 *                       reservasNoAprobadas:
 *                         type: integer
 *                         example: 0
 *                       reservasTotales:
 *                         type: integer
 *                         example: 11
 *                 estadisticas:
 *                   type: object
 *                   properties:
 *                     totalClientes:
 *                       type: integer
 *                       example: 100
 *                     clientesFiltrados:
 *                       type: integer
 *                       example: 10
 *                     clientes1a10:
 *                       type: integer
 *                       example: 5
 *                     clientes11a20:
 *                       type: integer
 *                       example: 3
 *                     clientes21a50:
 *                       type: integer
 *                       example: 2
 *                     clientes51a100:
 *                       type: integer
 *                       example: 0
 *       '500':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener los clientes con reservas
 */
router.get( "/clientes-con-reservas", authMiddleware.verifyToken, authMiddleware.verifyAdmin, usuarioController.getClientesConReservasPorEstado);

/**
 * @swagger
 * /cuidadores-con-reservas:
 *   get:
 *     summary: Obtener cuidadores con reservas por estado
 *     description: Permite obtener una lista de cuidadores con sus reservas filtradas por estado.
 *     tags: [Usuario]
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Nombre del cuidador
 *       - in: query
 *         name: apellido
 *         schema:
 *           type: string
 *         description: Apellido del cuidador
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Email del cuidador
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *         description: Estado del cuidador (Habilitado, No habilitado, Pendiente)
 *     responses:
 *       '200':
 *         description: Lista de cuidadores con reservas obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cuidadores:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 60d5f360a3f8b0928c8b4567
 *                       nombre:
 *                         type: string
 *                         example: Juan
 *                       apellido:
 *                         type: string
 *                         example: Perez
 *                       email:
 *                         type: string
 *                         example: cuidador@test.com
 *                       telefono:
 *                         type: string
 *                         example: 123456789
 *                       estado:
 *                         type: string
 *                         example: Habilitado
 *                       tarifa:
 *                         type: number
 *                         example: 20
 *                       promedioPuntuacion:
 *                         type: number
 *                         example: 4.5
 *                       reservasTotales:
 *                         type: integer
 *                         example: 11
 *                       reservasCanceladas:
 *                         type: integer
 *                         example: 2
 *                       reservasFinalizadas:
 *                         type: integer
 *                         example: 5
 *                       reservasAprobadas:
 *                         type: integer
 *                         example: 3
 *                       reservasPendientes:
 *                         type: integer
 *                         example: 1
 *                       reservasNoAprobadas:
 *                         type: integer
 *                         example: 0
 *                 estadisticas:
 *                   type: object
 *                   properties:
 *                     cuidadoresPendientes:
 *                       type: integer
 *                       example: 10
 *                     cuidadoresHabilitados:
 *                       type: integer
 *                       example: 5
 *                     cuidadoresNoHabilitados:
 *                       type: integer
 *                       example: 3
 *                     totalCuidadores:
 *                       type: integer
 *                       example: 18
 *                     cuidadoresFiltrados:
 *                       type: integer
 *                       example: 8
 *                     promedioPuntuacionHabilitados:
 *                       type: number
 *                       example: 4.2
 *       '500':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener los cuidadores con reservas
 */
router.get( "/cuidadores-con-reservas", authMiddleware.verifyToken, authMiddleware.verifyAdmin, usuarioController.getCuidadoresConReservasPorEstado);

// Ruta para cargar una imagen de perfil
/**
 * @swagger
 * /upload/{id}:
 *   post:
 *     summary: Cargar una imagen de perfil
 *     description: Permite cargar una imagen de perfil para un usuario.
 *     tags: [Usuario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: La imagen de perfil a cargar
 *     responses:
 *       '200':
 *         description: Imagen cargada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Imagen cargada exitosamente
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d5f360a3f8b0928c8b4567
 *                     nombre:
 *                       type: string
 *                       example: Juan
 *                     apellido:
 *                       type: string
 *                       example: Perez
 *                     email:
 *                       type: string
 *                       example: usuario@test.com
 *                     telefono:
 *                       type: string
 *                       example: 123456789
 *                     imagenPerfil:
 *                       type: string
 *                       example: https://example.com/imagen.jpg
 *       '500':
 *         description: Error al cargar la imagen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al cargar la imagen
 */
router.post("/upload/:id", authMiddleware.verifyToken, upload.single('file'), usuarioController.guardarImagenPerfil);

/**
 * @swagger
 * /habilitar-cuidador/{id}:
 *   put:
 *     summary: Habilitar un cuidador
 *     description: Permite habilitar a un cuidador pendiente.
 *     tags: [Usuario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cuidador a habilitar
 *     responses:
 *       '200':
 *         description: Cuidador habilitado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cuidador habilitado correctamente
 *       '500':
 *         description: Error al habilitar el cuidador
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al habilitar el cuidador
 */
router.put("/habilitar-cuidador/:id", authMiddleware.verifyToken, authMiddleware.verifyAdmin, usuarioController.habilitarCuidador);

/**
 * @swagger
 * /desaprobar-cuidador/{id}:
 *   put:
 *     summary: Desaprobar un cuidador
 *     description: Permite desaprobar a un cuidador pendiente.
 *     tags: [Usuario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cuidador a desaprobar
 *     responses:
 *       '200':
 *         description: Cuidador desaprobado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cuidador desaprobado correctamente
 *       '500':
 *         description: Error al desaprobar el cuidador
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al desaprobar el cuidador
 */
router.put("/desaprobar-cuidador/:id", authMiddleware.verifyToken, authMiddleware.verifyAdmin, usuarioController.desaprobarCuidador);

module.exports = router;
