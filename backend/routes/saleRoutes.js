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
 * /api/vendas:
 *   post:
 *     summary: Criar uma nova venda
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cliente:
 *                 type: string
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     produto:
 *                       type: string
 *                     quantidade:
 *                       type: number
 *               formaPagamento:
 *                 type: string
 *                 enum: [dinheiro, cartao_debito, cartao_credito, pix, transferencia]
 *               desconto:
 *                 type: number
 *               observacoes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Venda criada com sucesso
 *       400:
 *         description: Dados inválidos ou estoque insuficiente
 */
router.post('/criar', autenticar, criarVenda);

/**
 * @swagger
 * /api/vendas:
 *   get:
 *     summary: Listar vendas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Itens por página
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de início do filtro
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de fim do filtro
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
 *         description: Status da venda
 *     responses:
 *       200:
 *         description: Lista de vendas
 */
router.get('/', autenticar, listarVendas);

/**
 * @swagger
 * /api/vendas/estatisticas:
 *   get:
 *     summary: Obter estatísticas de vendas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de início do período
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de fim do período
 *     responses:
 *       200:
 *         description: Estatísticas de vendas
 */
router.get('/estatisticas', autenticar, obterEstatisticas);

/**
 * @swagger
 * /api/vendas/{id}:
 *   get:
 *     summary: Obter venda por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da venda
 *     responses:
 *       200:
 *         description: Dados da venda
 *       404:
 *         description: Venda não encontrada
 */
router.get('/:id', autenticar, obterVenda);

/**
 * @swagger
 * /api/vendas/{id}/cancelar:
 *   patch:
 *     summary: Cancelar uma venda
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da venda
 *     responses:
 *       200:
 *         description: Venda cancelada com sucesso
 *       404:
 *         description: Venda não encontrada
 *       400:
 *         description: Venda já cancelada
 */
router.patch('/:id/cancelar', autenticar, cancelarVenda);

router.patch('/:id', autenticar, atualizarVenda);

router.delete('/:id', autenticar, excluirVenda);

router.put('/:id', autenticar, atualizarVenda);

export default router;
