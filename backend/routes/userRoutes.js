import express from 'express';
import { registrar, login } from '../controllers/userController.js';

const router = express.Router();

/**
 * @swagger
 * /api/usuarios/registrar:
 *   post:
 *     summary: Registra um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               papel:
 *                 type: string
 *                 enum: [funcionario, administrador]
 *     responses:
 *       201:
 *         description: Usuário registrado
 */
router.post('/registrar', registrar);

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Realiza login do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 */
router.post('/login', login);

export default router;
