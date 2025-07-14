import Product from '../models/Product.js';

export const criarProduto = async (req, res) => {
  try {
    const produto = new Product(req.body);
    await produto.save();
    res.status(201).json(produto);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

export const listarProdutos = async (req, res) => {
  try {
    const produtos = await Product.find();
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

export const atualizarProduto = async (req, res) => {
  try {
    const produto = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
    res.json(produto);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

export const deletarProduto = async (req, res) => {
  try {
    const produto = await Product.findByIdAndDelete(req.params.id);
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
    res.json({ mensagem: 'Produto removido' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
