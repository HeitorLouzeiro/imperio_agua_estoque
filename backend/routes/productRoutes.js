import express from 'express';
import { criarProduto, listarProdutos, atualizarProduto, deletarProduto } from '../controllers/productController.js';
import { autenticar } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de produtos
 *   post:
 *     summary: Cria um novo produto
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *               marca:
 *                 type: string
 *               preco:
 *                 type: number
 *               quantidade:
 *                 type: number
 *     responses:
 *       201:
 *         description: Produto criado
 */
router.get('/', autenticar, listarProdutos);
router.post('/', autenticar, criarProduto);

/**
 * @swagger
 * /api/produtos/{id}:
 *   put:
 *     summary: Atualiza um produto
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *               marca:
 *                 type: string
 *               preco:
 *                 type: number
 *               quantidade:
 *                 type: number
 *     responses:
 *       200:
 *         description: Produto atualizado
 *   delete:
 *     summary: Remove um produto
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto removido
 */
router.put('/:id', autenticar, atualizarProduto);
router.delete('/:id', autenticar, deletarProduto);

export default router;
