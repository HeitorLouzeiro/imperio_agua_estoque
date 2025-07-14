import express from 'express';
import { criarProduto, listarProdutos, atualizarProduto, deletarProduto } from '../controllers/productController.js';
import { autenticar } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', autenticar, listarProdutos);
router.post('/', autenticar, criarProduto);
router.put('/:id', autenticar, atualizarProduto);
router.delete('/:id', autenticar, deletarProduto);

export default router;
