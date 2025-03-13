const express = require("express");
const router = express.Router();
const etapaVidaController = require("../controllers/etapaVidaController.js");
const authMiddleware = require("../services/authMiddlewareService.js");

/**
 * @swagger
 * tags:
 *   name: Etapa de Vida
 *   description: API para gestionar Etapas de Vida
 */

/**
 * @swagger
 * /api/etapasVida:
 *   get:
 *     summary: Obtener todas las etapas de vida
 *     description: Permite obtener una lista de todas las etapas de vida.
 *     tags: [Etapa de Vida]
 *     responses:
 *       '200':
 *         description: Lista de etapas de vida obtenida con éxito
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
 *                   nombre:
 *                     type: string
 *                     example: Cachorro
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener las etapas de vida
 */
router.get("/", authMiddleware.verifyToken, etapaVidaController.getEtapasVida);

/**
 * @swagger
 * /api/etapasVida:
 *   post:
 *     summary: Crear una nueva etapa de vida
 *     description: Permite crear una nueva etapa de vida en el sistema.
 *     tags: [Etapa de Vida]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: El nombre de la etapa de vida
 *                 example: Cachorro
 *     responses:
 *       '201':
 *         description: Etapa de vida creada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 60d5f360a3f8b0928c8b4567
 *                 nombre:
 *                   type: string
 *                   example: Cachorro
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al crear la etapa de vida
 */
router.post(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  etapaVidaController.createEtapaVida
);

/**
 * @swagger
 * /api/etapasVida/{id}:
 *   delete:
 *     summary: Eliminar una etapa de vida
 *     description: Permite eliminar una etapa de vida del sistema.
 *     tags: [Etapa de Vida]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la etapa de vida a eliminar
 *     responses:
 *       '200':
 *         description: Etapa de vida eliminada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Etapa de vida eliminada con éxito
 *       '404':
 *         description: Etapa de vida no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Etapa de vida no encontrada
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al eliminar la etapa de vida
 */
router.delete(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  etapaVidaController.deleteEtapaVida
);

/**
 * @swagger
 * /api/etapasVida/{id}:
 *   put:
 *     summary: Editar una etapa de vida
 *     description: Permite editar una etapa de vida existente en el sistema.
 *     tags: [Etapa de Vida]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la etapa de vida a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: El nombre de la etapa de vida
 *                 example: Adulto
 *     responses:
 *       '200':
 *         description: Etapa de vida editada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Etapa de vida editada con éxito
 *       '404':
 *         description: Etapa de vida no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Etapa de vida no encontrada
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al editar la etapa de vida
 */
router.put(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  etapaVidaController.editEtapaVida
);
/**
 * @swagger
 * /api/etapasVida/mascota/{idMascota}:
 *   get:
 *     summary: Obtener la etapa de vida por ID de mascota
 *     description: Permite obtener la etapa de vida asociada a una mascota específica.
 *     tags: [Etapa de Vida]
 *     parameters:
 *       - in: path
 *         name: idMascota
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota
 *     responses:
 *       '200':
 *         description: Etapa de vida obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 60d5f360a3f8b0928c8b4567
 *                 nombre:
 *                   type: string
 *                   example: Cachorro
 *       '404':
 *         description: Mascota no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mascota no encontrada
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener la etapa de vida
 */
router.get(
  "/mascota/:idMascota",
  authMiddleware.verifyToken,
  etapaVidaController.getEtapaVidaByMascotaId
);

module.exports = router;
