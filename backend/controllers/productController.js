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

export const buscarProdutoPorCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;
    if (!codigo) {
      return res.status(400).json({ erro: 'Informe o código para buscar' });
    }
    const produto = await Product.findOne({ codigo });
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
    res.json(produto);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const produto = await Product.findById(req.params.id);
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
    res.json(produto);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

export const buscarProdutoPorMarca = async (req, res) => {
  try {
    const { marca } = req.params;
    if (!marca) {
      return res.status(400).json({ erro: 'Informe a marca para buscar' });
    }
    const produto = await Product.findOne({ marca });
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
    res.json(produto);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

