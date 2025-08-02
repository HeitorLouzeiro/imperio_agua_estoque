import express from 'express';
import { criarProduto, listarProdutos, atualizarProduto, deletarProduto,buscarProdutoPorCodigo, buscarProdutoPorMarca, getById, reativarProduto, listarProdutosInativos  } from '../controllers/productController.js';
import { autenticar } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Produto:
 *       type: object
 *       required:
 *         - codigo
 *         - nome
 *         - marca
 *         - preco
 *         - estoque
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único do produto
 *         codigo:
 *           type: string
 *           description: Código do produto
 *         nome:
 *           type: string
 *           description: Nome do produto
 *         marca:
 *           type: string
 *           description: Marca do produto
 *         preco:
 *           type: number
 *           format: float
 *           description: Preço do produto
 *         estoque:
 *           type: integer
 *           description: Quantidade em estoque
 *         ativo:
 *           type: boolean
 *           description: Status ativo/inativo do produto
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *     ProdutoInput:
 *       type: object
 *       required:
 *         - codigo
 *         - nome
 *         - marca
 *         - preco
 *         - estoque
 *       properties:
 *         codigo:
 *           type: string
 *           description: Código do produto
 *         nome:
 *           type: string
 *           description: Nome do produto
 *         marca:
 *           type: string
 *           description: Marca do produto
 *         preco:
 *           type: number
 *           format: float
 *           description: Preço do produto
 *         estoque:
 *           type: integer
 *           description: Quantidade em estoque
 */

/**
 * @swagger
 * /api/produtos:
 *   get:
 *     summary: Lista todos os produtos ativos
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de produtos obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produto'
 *       401:
 *         description: Token não fornecido ou inválido
 *       500:
 *         description: Erro interno do servidor
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProdutoInput'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       400:
 *         description: Dados inválidos ou produto já existe
 *       401:
 *         description: Token não fornecido ou inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', autenticar, listarProdutos);
router.post('/', autenticar, criarProduto);

/**
 * @swagger
 * /api/produtos/{id}:
 *   get:
 *     summary: Busca um produto pelo ID
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Produto não encontrado
 *       401:
 *         description: Token não fornecido ou inválido
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza um produto pelo ID
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProdutoInput'
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Produto não encontrado
 *       401:
 *         description: Token não fornecido ou inválido
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Remove (desativa) um produto pelo ID
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto removido com sucesso
 *       404:
 *         description: Produto não encontrado
 *       401:
 *         description: Token não fornecido ou inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', autenticar, getById);
router.put('/:id', autenticar, atualizarProduto);
router.delete('/:id', autenticar, deletarProduto);

/**
 * @swagger
 * /api/produtos/codigo/{codigo}:
 *   get:
 *     summary: Busca um produto pelo código
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         description: Código do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Produto não encontrado
 *       401:
 *         description: Token não fornecido ou inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/codigo/:codigo', autenticar, buscarProdutoPorCodigo);

/**
 * @swagger
 * /api/produtos/marca/{marca}:
 *   get:
 *     summary: Lista produtos por marca
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: marca
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome da marca
 *     responses:
 *       200:
 *         description: Lista de produtos da marca
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Nenhum produto encontrado para a marca
 *       401:
 *         description: Token não fornecido ou inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/marca/:marca', autenticar, buscarProdutoPorMarca);

/**
 * @swagger
 * /api/produtos/inativos/listar:
 *   get:
 *     summary: Lista todos os produtos inativos
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de produtos inativos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produto'
 *       401:
 *         description: Token não fornecido ou inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/inativos/listar', autenticar, listarProdutosInativos);

/**
 * @swagger
 * /api/produtos/{id}/reativar:
 *   patch:
 *     summary: Reativa um produto inativo
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto reativado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Produto não encontrado
 *       400:
 *         description: Produto já está ativo
 *       401:
 *         description: Token não fornecido ou inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.patch('/:id/reativar', autenticar, reativarProduto);

export default router;
