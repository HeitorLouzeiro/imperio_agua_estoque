import express from 'express';
import {  atualizarUsuarioById, excluirUsuario, listarUsuarios, login, obterPerfil, registrar } from '../controllers/userController.js';
import { autenticar } from '../middlewares/auth.js';

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

router.get('/listuser', autenticar, listarUsuarios);

router.get('/perfil', autenticar, obterPerfil);

router.put('/:id', autenticar, atualizarUsuarioById);

router.delete('/:id', autenticar, excluirUsuario);

export default router;
