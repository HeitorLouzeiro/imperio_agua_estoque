import express from 'express';
import { criarProduto, listarProdutos, atualizarProduto, deletarProduto,buscarProdutoPorCodigo, buscarProdutoPorMarca, getById, reativarProduto, listarProdutosInativos  } from '../controllers/productController.js';
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
/**
 * @swagger
 * /api/produtos:
 *  get:
 * summary: Lista todos os produtos
 * security:
 * - bearerAuth: []
 * responses:
 *   200:
 *     description: Lista de produtos
 *     content:
 *       application/json:
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Produto'
 */

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

router.get('/:id', autenticar, getById);

router.get('/codigo/:codigo', autenticar, buscarProdutoPorCodigo);
/**
 * @swagger
 * /api/produtos/codigo/{codigo}:
 *   get:
 *     summary: Busca um produto pelo código
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto encontrado
 *       404:
 *         description: Produto não encontrado
 */

router.get('/marca/:marca', autenticar, buscarProdutoPorMarca);

/**
 * @swagger
 * /api/produtos/marca/{marca}:
 *   get:
 *     description: Lista produtos por marca
 *     parameters:
 *       - in: path
 *         name: marca
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome da marcao
 */

// Rotas para gerenciamento de produtos inativos
router.get('/inativos/listar', autenticar, listarProdutosInativos);
router.patch('/:id/reativar', autenticar, reativarProduto);

export default router;
