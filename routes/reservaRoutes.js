const express = require("express");
const router = express.Router();
const reservaController = require("../controllers/reservaController.js");
const authMiddleware = require("../services/authMiddlewareService.js");
/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: API para gestionar Reservas
 */

/**
 * @swagger
 * /api/reservas:
 *   post:
 *     summary: Crear una nueva reserva
 *     description: Permite crear una nueva reserva y sus turnos asociados.
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio de la reserva
 *                 example: 2023-10-15
 *               fechaFin:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin de la reserva
 *                 example: 2023-10-20
 *               comentario:
 *                 type: string
 *                 description: Comentario sobre la reserva
 *                 example: Necesito que cuiden a mi perro
 *               cuidador:
 *                 type: string
 *                 description: ID del cuidador
 *                 example: 60d5f360a3f8b0928c8b4567
 *               mascotas:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: IDs de las mascotas
 *                 example: ["60d5f360a3f8b0928c8b4567", "60d5f360a3f8b0928c8b4568"]
 *               horaTurno:
 *                 type: string
 *                 description: Hora del turno
 *                 example: "08:00"
 *     responses:
 *       '201':
 *         description: Reserva creada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 60d5f360a3f8b0928c8b4567
 *                 fechaInicio:
 *                   type: string
 *                   format: date
 *                   example: 2023-10-15
 *                 fechaFin:
 *                   type: string
 *                   format: date
 *                   example: 2023-10-20
 *                 comentario:
 *                   type: string
 *                   example: Necesito que cuiden a mi perro
 *                 cuidador:
 *                   type: string
 *                   example: 60d5f360a3f8b0928c8b4567
 *                 mascotas:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["60d5f360a3f8b0928c8b4567", "60d5f360a3f8b0928c8b4568"]
 *                 horaTurno:
 *                   type: string
 *                   example: "08:00"
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al crear la reserva
 */
router.post(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.verifyCliente,
  reservaController.createReserva
);

/**
 * @swagger
 * /api/reservas/{id}:
 *   delete:
 *     summary: Eliminar una reserva
 *     description: Permite eliminar una reserva que esté en estado Pendiente.
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva a eliminar
 *     responses:
 *       '200':
 *         description: Reserva eliminada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reserva eliminada con éxito
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No se puede eliminar una reserva que no esté en estado Pendiente
 */
router.delete(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  reservaController.deleteReserva
);

/**
 * @swagger
 * /api/reservas/{id}:
 *   put:
 *     summary: Editar una reserva
 *     description: Permite editar la información de una reserva.
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tarifaTurno:
 *                 type: number
 *                 description: Tarifa por turno
 *                 example: 20
 *               comentario:
 *                 type: string
 *                 description: Comentario sobre la reserva
 *                 example: Necesito que cuiden a mi perro
 *               mascotas:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: IDs de las mascotas
 *                 example: ["60d5f360a3f8b0928c8b4567", "60d5f360a3f8b0928c8b4568"]
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio de la reserva
 *                 example: 2023-10-15
 *               fechaFin:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin de la reserva
 *                 example: 2023-10-20
 *     responses:
 *       '200':
 *         description: Reserva editada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reserva editada con éxito
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al editar la reserva
 */
router.put("/:id", authMiddleware.verifyToken, reservaController.editReserva);

/**
 * @swagger
 * /api/reservas/reservasPorCliente/{id}:
 *   get:
 *     summary: Obtener reservas por cliente
 *     description: Permite obtener una lista de reservas de un cliente específico.
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       '200':
 *         description: Lista de reservas obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 60d5f360a3f8b0928c8b4567
 *                   fechaInicio:
 *                     type: string
 *                     format: date
 *                     example: 2023-10-15
 *                   fechaFin:
 *                     type: string
 *                     format: date
 *                     example: 2023-10-20
 *                   comentario:
 *                     type: string
 *                     example: Necesito que cuiden a mi perro
 *                   cuidador:
 *                     type: object
 *                     properties:
 *                       nombre:
 *                         type: string
 *                         example: Juan
 *                       apellido:
 *                         type: string
 *                         example: Perez
 *                       telefono:
 *                         type: string
 *                         example: 123456789
 *                   mascotas:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         nombre:
 *                           type: string
 *                           example: Fido
 *                   estado:
 *                     type: object
 *                     properties:
 *                       estado:
 *                         type: string
 *                         example: Aprobada
 *                   resenia:
 *                     type: object
 *                     properties:
 *                       puntuacion:
 *                         type: number
 *                         example: 5
 *                       comentario:
 *                         type: string
 *                         example: Excelente servicio
 *                   horaTurno:
 *                     type: string
 *                     example: "08"
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener las reservas
 */
router.get(
  "/reservasPorCliente/:id",
  authMiddleware.verifyToken,
  authMiddleware.verifyCliente,
  reservaController.getReservasPorCliente
);

/**
 * @swagger
 * /api/reservas/reservasPorCuidador/{id}:
 *   get:
 *     summary: Obtener reservas por cuidador
 *     description: Permite obtener una lista de reservas de un cuidador específico.
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cuidador
 *     responses:
 *       '200':
 *         description: Lista de reservas obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 60d5f360a3f8b0928c8b4567
 *                   fechaInicio:
 *                     type: string
 *                     format: date
 *                     example: 2023-10-15
 *                   fechaFin:
 *                     type: string
 *                     format: date
 *                     example: 2023-10-20
 *                   comentario:
 *                     type: string
 *                     example: Necesito que cuiden a mi perro
 *                   cliente:
 *                     type: object
 *                     properties:
 *                       nombre:
 *                         type: string
 *                         example: Juan
 *                       apellido:
 *                         type: string
 *                         example: Perez
 *                       telefono:
 *                         type: string
 *                         example: 123456789
 *                   mascotas:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         nombre:
 *                           type: string
 *                           example: Fido
 *                   estado:
 *                     type: object
 *                     properties:
 *                       estado:
 *                         type: string
 *                         example: Aprobada
 *                   resenia:
 *                     type: object
 *                     properties:
 *                       puntuacion:
 *                         type: number
 *                         example: 5
 *                       comentario:
 *                         type: string
 *                         example: Excelente servicio
 *                   horaTurno:
 *                     type: string
 *                     example: "08"
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener las reservas
 */
router.get(
  "/reservasPorCuidador/:id",
  authMiddleware.verifyToken,
  authMiddleware.verifyCuidadorHabilitado,
  reservaController.getReservasPorCuidador
);

/**
 * @swagger
 * /api/reservas/turnosPorReserva/{idReserva}:
 *   get:
 *     summary: Obtener turnos por reserva
 *     description: Permite obtener una lista de turnos de una reserva específica.
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: idReserva
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva
 *     responses:
 *       '200':
 *         description: Lista de turnos obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   fecha:
 *                     type: string
 *                     example: "15-10-2023"
 *                   hora:
 *                     type: string
 *                     example: "08:00"
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener los turnos
 */
router.get(
  "/turnosPorReserva/:idReserva",
  authMiddleware.verifyToken,
  reservaController.getTurnosPorReserva
);

/**
 * @swagger
 * /api/reservas/cancelar/{idReserva}:
 *   put:
 *     summary: Cancelar una reserva
 *     description: Permite cancelar una reserva que esté en estado Pendiente o Aprobada.
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: idReserva
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva a cancelar
 *     responses:
 *       '200':
 *         description: Reserva cancelada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reserva cancelada con éxito
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al cancelar la reserva
 */
router.put(
  "/cancelar/:idReserva",
  authMiddleware.verifyToken,
  authMiddleware.verifyCliente,
  reservaController.cancelarReserva
);

/**
 * @swagger
 * /api/reservas/aprobar/{idReserva}:
 *   put:
 *     summary: Aprobar una reserva
 *     description: Permite aprobar una reserva que esté en estado Pendiente.
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: idReserva
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva a aprobar
 *     responses:
 *       '200':
 *         description: Reserva aprobada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reserva aprobada con éxito
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al aprobar la reserva
 */
router.put(
  "/aprobar/:idReserva",
  authMiddleware.verifyToken,
  authMiddleware.verifyCuidadorHabilitado,
  reservaController.aprobarReserva
);

/**
 * @swagger
 * /api/reservas/rechazar/{idReserva}:
 *   put:
 *     summary: Rechazar una reserva
 *     description: Permite rechazar una reserva que esté en estado Pendiente.
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: idReserva
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva a rechazar
 *     responses:
 *       '200':
 *         description: Reserva rechazada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reserva rechazada con éxito
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al rechazar la reserva
 */
router.put(
  "/rechazar/:idReserva",
  authMiddleware.verifyToken,
  authMiddleware.verifyCuidadorHabilitado,
  reservaController.rechazarReserva
);

/**
 * @swagger
 * /api/reservas/anular/{idReserva}:
 *   put:
 *     summary: Anular una reserva
 *     description: Permite anular una reserva que esté en estado Aprobada.
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: idReserva
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva a anular
 *     responses:
 *       '200':
 *         description: Reserva anulada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reserva anulada con éxito
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al anular la reserva
 */
router.put(
  "/anular/:idReserva",
  authMiddleware.verifyToken,
  authMiddleware.verifyCuidadorHabilitado,
  reservaController.anularReserva
);

/**
 * @swagger
 * /api/reservas/{id}:
 *   get:
 *     summary: Obtener una reserva
 *     description: Permite obtener la información de una reserva específica.
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva a obtener
 *     responses:
 *       '200':
 *         description: Reserva obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 60d5f360a3f8b0928c8b4567
 *                 fechaInicio:
 *                   type: string
 *                   format: date
 *                   example: 2023-10-15
 *                 fechaFin:
 *                   type: string
 *                   format: date
 *                   example: 2023-10-20
 *                 comentario:
 *                   type: string
 *                   example: Necesito que cuiden a mi perro
 *                 cuidador:
 *                   type: string
 *                   example: 60d5f360a3f8b0928c8b4567
 *                 mascotas:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["60d5f360a3f8b0928c8b4567", "60d5f360a3f8b0928c8b4568"]
 *                 horaTurno:
 *                   type: string
 *                   example: "08:00"
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener la reserva
 */
router.get("/:id", authMiddleware.verifyToken, reservaController.getOneReserva);

module.exports = router;
