const express = require("express");
const router = express.Router();
const disponibilidadCuidadorController = require("../controllers/disponibilidadCuidadorController.js");
const authMiddleware = require("../services/authMiddlewareService.js");

/**
 * @swagger
 * tags:
 *   name: Disponibilidad Cuidador
 *   description: API para gestionar Disponibilidad de Cuidadores
 */

/**
 * @swagger
 * /api/disponibilidadCuidador:
 *   get:
 *     summary: Obtener disponibilidades por cuidador
 *     description: Permite obtener una lista de disponibilidades de un cuidador específico.
 *     tags: [Disponibilidad Cuidador]
 *     responses:
 *       '200':
 *         description: Lista de disponibilidades obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   fecha:
 *                     type: string
 *                     format: date
 *                     example: 2023-10-15
 *                   horas:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["08:00", "09:00", "10:00"]
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener disponibilidades
 */
router.get(
  "/",
  authMiddleware.verifyToken,
  disponibilidadCuidadorController.getDisponibilidadesPorCuidador
);

/**
 * @swagger
 * /api/disponibilidadCuidador:
 *   post:
 *     summary: Crear una nueva disponibilidad
 *     description: Permite crear una nueva disponibilidad para un cuidador.
 *     tags: [Disponibilidad Cuidador]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la disponibilidad
 *                 example: 2023-10-15
 *               horarios:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     horaInicio:
 *                       type: string
 *                       description: Hora de inicio de la disponibilidad
 *                       example: "08:00"
 *     responses:
 *       '201':
 *         description: Disponibilidad creada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fecha:
 *                   type: string
 *                   format: date
 *                   example: 2023-10-15
 *                 horas:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["08:00", "09:00", "10:00"]
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al crear disponibilidad
 */
router.post(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.verifyCuidadorHabilitado,
  disponibilidadCuidadorController.createDisponibilidad
);

/**
 * @swagger
 * /api/disponibilidadCuidador/update:
 *   post:
 *     summary: Crear o actualizar una disponibilidad
 *     description: Permite crear o actualizar una disponibilidad para un cuidador.
 *     tags: [Disponibilidad Cuidador]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la disponibilidad
 *                 example: 2023-10-15
 *               horarios:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     horaInicio:
 *                       type: string
 *                       description: Hora de inicio de la disponibilidad
 *                       example: "08:00"
 *     responses:
 *       '201':
 *         description: Disponibilidad creada o actualizada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fecha:
 *                   type: string
 *                   format: date
 *                   example: 2023-10-15
 *                 horas:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["08:00", "09:00", "10:00"]
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al crear o actualizar disponibilidad
 */
router.post(
  "/update",
  authMiddleware.verifyToken,
  authMiddleware.verifyCuidadorHabilitado,
  disponibilidadCuidadorController.createOrUpdateDisponibilidad
);

/**
 * @swagger
 * /api/disponibilidadCuidador/{id}:
 *   delete:
 *     summary: Eliminar una disponibilidad
 *     description: Permite eliminar una disponibilidad por su ID.
 *     tags: [Disponibilidad Cuidador]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la disponibilidad a eliminar
 *     responses:
 *       '200':
 *         description: Disponibilidad eliminada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Disponibilidad eliminada con éxito
 *       '404':
 *         description: Disponibilidad no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Disponibilidad no encontrada
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al eliminar disponibilidad
 */
router.delete(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.verifyCuidadorHabilitado,
  disponibilidadCuidadorController.deleteDisponibilidad
);

/**
 * @swagger
 * /api/disponibilidadCuidador/{id}:
 *   put:
 *     summary: Actualizar una disponibilidad
 *     description: Permite actualizar una disponibilidad existente para un cuidador.
 *     tags: [Disponibilidad Cuidador]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la disponibilidad a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               horarios:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["08:00", "09:00", "10:00"]
 *     responses:
 *       '200':
 *         description: Disponibilidad actualizada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fecha:
 *                   type: string
 *                   format: date
 *                   example: 2023-10-15
 *                 horas:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["08:00", "09:00", "10:00"]
 *       '404':
 *         description: Disponibilidad no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Disponibilidad no encontrada
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al actualizar disponibilidad
 */
router.put(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.verifyCuidadorHabilitado,
  disponibilidadCuidadorController.updateDisponibilidad
);

module.exports = router;
