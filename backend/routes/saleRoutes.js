import express from 'express';
import {
  atualizarVenda,
  cancelarVenda,
  criarVenda,
  excluirVenda,
  listarVendas,
  obterEstatisticas,
  obterVenda
} from '../controllers/saleController.js';
import { autenticar } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ItemVenda:
 *       type: object
 *       required:
 *         - produto
 *         - quantidade
 *       properties:
 *         produto:
 *           type: string
 *           description: ID do produto
 *         quantidade:
 *           type: integer
 *           minimum: 1
 *           description: Quantidade do produto
 *         preco:
 *           type: number
 *           format: float
 *           description: Preço unitário do produto
 *         subtotal:
 *           type: number
 *           format: float
 *           description: Subtotal do item (quantidade × preço)
 *     Venda:
 *       type: object
 *       required:
 *         - cliente
 *         - itens
 *         - formaPagamento
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único da venda
 *         cliente:
 *           type: string
 *           description: Nome do cliente
 *         itens:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ItemVenda'
 *           description: Lista de itens da venda
 *         subtotal:
 *           type: number
 *           format: float
 *           description: Subtotal antes do desconto
 *         desconto:
 *           type: number
 *           format: float
 *           default: 0
 *           description: Valor do desconto aplicado
 *         total:
 *           type: number
 *           format: float
 *           description: Valor total da venda
 *         formaPagamento:
 *           type: string
 *           enum: [dinheiro, cartao_debito, cartao_credito, pix, transferencia]
 *           description: Forma de pagamento utilizada
 *         status:
 *           type: string
 *           enum: [pendente, paga, cancelada]
 *           default: pendente
 *           description: Status da venda
 *         observacoes:
 *           type: string
 *           description: Observações adicionais sobre a venda
 *         vendedor:
 *           type: string
 *           description: ID do usuário que realizou a venda
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação da venda
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *     VendaInput:
 *       type: object
 *       required:
 *         - cliente
 *         - itens
 *         - formaPagamento
 *       properties:
 *         cliente:
 *           type: string
 *           description: Nome do cliente
 *         itens:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - produto
 *               - quantidade
 *             properties:
 *               produto:
 *                 type: string
 *                 description: ID do produto
 *               quantidade:
 *                 type: integer
 *                 minimum: 1
 *                 description: Quantidade do produto
 *           description: Lista de itens da venda
 *         formaPagamento:
 *           type: string
 *           enum: [dinheiro, cartao_debito, cartao_credito, pix, transferencia]
 *           description: Forma de pagamento
 *         desconto:
 *           type: number
 *           format: float
 *           default: 0
 *           description: Valor do desconto
 *         observacoes:
 *           type: string
 *           description: Observações adicionais
 *     EstatisticasVenda:
 *       type: object
 *       properties:
 *         totalVendas:
 *           type: integer
 *           description: Número total de vendas
 *         valorTotal:
 *           type: number
 *           format: float
 *           description: Valor total das vendas
 *         valorMedio:
 *           type: number
 *           format: float
 *           description: Valor médio por venda
 *         produtosMaisVendidos:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               produto:
 *                 type: string
 *               quantidade:
 *                 type: integer
 *               total:
 *                 type: number
 *           description: Lista dos produtos mais vendidos
 */

/**
 * @swagger
 * /api/vendas/criar:
 *   post:
 *     summary: Criar uma nova venda
 *     tags: [Vendas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VendaInput'
 *     responses:
 *       201:
 *         description: Venda criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Venda'
 *       400:
 *         description: Dados inválidos ou estoque insuficiente
 *       401:
 *         description: Token não fornecido ou inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/criar', autenticar, criarVenda);

/**
 * @swagger
 * /api/vendas:
 *   get:
 *     summary: Listar todas as vendas
 *     tags: [Vendas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Itens por página
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial para filtro (YYYY-MM-DD)
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final para filtro (YYYY-MM-DD)
 *       - in: query
 *         name: cliente
 *         schema:
 *           type: string
 *         description: Nome do cliente para filtrar
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pendente, paga, cancelada]
 *         description: Status da venda para filtrar
 *     responses:
 *       200:
 *         description: Lista de vendas com paginação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vendas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Venda'
 *                 totalPages:
 *                   type: integer
 *                   description: Total de páginas
 *                 currentPage:
 *                   type: integer
 *                   description: Página atual
 *                 totalVendas:
 *                   type: integer
 *                   description: Total de vendas
 *       401:
 *         description: Token não fornecido ou inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', autenticar, listarVendas);

/**
 * @swagger
 * /api/vendas/estatisticas:
 *   get:
 *     summary: Obter estatísticas de vendas
 *     tags: [Vendas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial para estatísticas (YYYY-MM-DD)
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final para estatísticas (YYYY-MM-DD)
 *       - in: query
 *         name: periodo
 *         schema:
 *           type: string
 *           enum: [hoje, semana, mes, ano]
 *         description: Período predefinido para estatísticas
 *     responses:
 *       200:
 *         description: Estatísticas detalhadas das vendas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstatisticasVenda'
 *       401:
 *         description: Token não fornecido ou inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/estatisticas', autenticar, obterEstatisticas);

/**
 * @swagger
 * /api/vendas/{id}:
 *   get:
 *     summary: Obter uma venda específica por ID
 *     tags: [Vendas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único da venda
 *     responses:
 *       200:
 *         description: Dados detalhados da venda
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Venda'
 *       404:
 *         description: Venda não encontrada
 *       401:
 *         description: Token não fornecido ou inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', autenticar, obterVenda);

/**
 * @swagger
 * /api/vendas/{id}/cancelar:
 *   patch:
 *     summary: Cancelar uma venda existente
 *     tags: [Vendas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único da venda a ser cancelada
 *     responses:
 *       200:
 *         description: Venda cancelada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Venda'
 *       404:
 *         description: Venda não encontrada
 *       400:
 *         description: Venda não pode ser cancelada (já paga ou já cancelada)
 *       401:
 *         description: Token não fornecido ou inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.patch('/:id/cancelar', autenticar, cancelarVenda);

/**
 * @swagger
 * /api/vendas/{id}:
 *   patch:
 *     summary: Atualizar dados de uma venda
 *     tags: [Vendas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único da venda
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cliente:
 *                 type: string
 *                 description: Nome do cliente
 *               formaPagamento:
 *                 type: string
 *                 enum: [dinheiro, cartao_debito, cartao_credito, pix, transferencia]
 *                 description: Forma de pagamento
 *               desconto:
 *                 type: number
 *                 format: float
 *                 description: Valor do desconto aplicado
 *               observacoes:
 *                 type: string
 *                 description: Observações adicionais
 *               status:
 *                 type: string
 *                 enum: [pendente, paga, cancelada]
 *                 description: Status da venda
 *     responses:
 *       200:
 *         description: Venda atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Venda'
 *       400:
 *         description: Dados inválidos fornecidos
 *       404:
 *         description: Venda não encontrada
 *       401:
 *         description: Token não fornecido ou inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.patch('/:id', autenticar, atualizarVenda);

/**
 * @swagger
 * /api/vendas/{id}:
 *   delete:
 *     summary: Excluir uma venda
 *     tags: [Vendas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único da venda a ser excluída
 *     responses:
 *       200:
 *         description: Venda excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Venda excluída com sucesso
 *       404:
 *         description: Venda não encontrada
 *       401:
 *         description: Token não fornecido ou inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', autenticar, excluirVenda);

/**
 * @swagger
 * /api/vendas/{id}:
 *   put:
 *     summary: Atualizar completamente uma venda
 *     tags: [Vendas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único da venda
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VendaInput'
 *     responses:
 *       200:
 *         description: Venda atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Venda'
 *       400:
 *         description: Dados inválidos ou estoque insuficiente
 *       404:
 *         description: Venda não encontrada
 *       401:
 *         description: Token não fornecido ou inválido
 *       500:
 *         description: Erro interno do servidor
 */

router.put('/:id', autenticar, atualizarVenda);

export default router;
