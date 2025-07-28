import Product from '../models/Product.js';
import Sale from '../models/Sale.js';

// Criar uma nova venda
export const criarVenda = async (req, res) => {
  try {
    const { cliente, itens, formaPagamento, desconto = 0, observacoes } = req.body;
    const vendedor = req.userId;

    // Validar produtos e montar lista de itens com preço e subtotal
    const itensProcessados = [];

    for (const item of itens) {
      const produto = await Product.findById(item.produto);
      if (!produto) {
        return res.status(404).json({ erro: `Produto ${item.produto} não encontrado` });
      }

      if (produto.quantidade < item.quantidade) {
        return res.status(400).json({
          erro: `Estoque insuficiente para ${produto.nome}. Disponível: ${produto.quantidade}`
        });
      }

      itensProcessados.push({
        produto: produto._id,
        quantidade: item.quantidade,
        precoUnitario: produto.preco,
        subtotal: item.quantidade * produto.preco
      });
    }

    // Criar a venda com os itens processados
    const venda = new Sale({
      cliente,
      vendedor,
      itens: itensProcessados,
      formaPagamento,
      desconto,
      observacoes
    });

    // Salvar a venda (número, subtotal, total são preenchidos automaticamente no pre('save'))
    await venda.save();

    // Atualizar estoque dos produtos
    for (const item of itensProcessados) {
      await Product.findByIdAndUpdate(
        item.produto,
        { $inc: { quantidade: -item.quantidade } }
      );
    }

    await venda.populate(['vendedor', 'itens.produto']);
    res.status(201).json(venda);
  } catch (err) {
    console.error('Erro ao criar venda:', err);
    res.status(400).json({ erro: err.message });
  }
};

// Listar todas as vendas
export const listarVendas = async (req, res) => {
  try {
    const { page = 1, limit = 10, dataInicio, dataFim, cliente, status } = req.query;

    const filtros = {};

    if (dataInicio || dataFim) {
      filtros.dataVenda = {};
      if (dataInicio) filtros.dataVenda.$gte = new Date(dataInicio);
      if (dataFim) filtros.dataVenda.$lte = new Date(dataFim);
    }

    if (cliente) {
      filtros.cliente = { $regex: cliente, $options: 'i' };
    }

    if (status) {
      filtros.status = status;
    }

    const vendas = await Sale.find(filtros)
      .populate('vendedor', 'nome email')
      .populate('itens.produto', 'nome codigo')
      .sort({ dataVenda: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Sale.countDocuments(filtros);

    res.json({
      vendas,
      totalPaginas: Math.ceil(total / limit),
      paginaAtual: page,
      total
    });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// Obter uma venda por ID
export const obterVenda = async (req, res) => {
  try {
    const venda = await Sale.findById(req.params.id)
      .populate('vendedor', 'nome email')
      .populate('itens.produto', 'nome codigo preco');

    if (!venda) {
      return res.status(404).json({ erro: 'Venda não encontrada' });
    }

    res.json(venda);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// Cancelar uma venda
export const cancelarVenda = async (req, res) => {
  try {
    const venda = await Sale.findById(req.params.id).populate('itens.produto');

    if (!venda) {
      return res.status(404).json({ erro: 'Venda não encontrada' });
    }

    if (venda.status === 'cancelada') {
      return res.status(400).json({ erro: 'Venda já está cancelada' });
    }

    // Restaurar estoque
    for (const item of venda.itens) {
      await Product.findByIdAndUpdate(
        item.produto._id,
        { $inc: { quantidade: item.quantidade } }
      );
    }

    venda.status = 'cancelada';
    await venda.save();

    res.json({ message: 'Venda cancelada com sucesso', venda });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// Excluir uma venda
export const excluirVenda = async (req, res) => {
  try {
    const venda = await Sale.findByIdAndDelete(req.params.id);
    if (!venda) {
      return res.status(404).json({ erro: 'Venda não encontrada' });
    }

    // Restaurar estoque dos produtos
    for (const item of venda.itens) {
      await Product.findByIdAndUpdate(
        item.produto,
        { $inc: { quantidade: item.quantidade } }
      );
    }

    res.json({ message: 'Venda excluída com sucesso' });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

export const atualizarVenda = async (req, res) => {
  try {
    const venda = await Sale.findById(req.params.id);
    if (!venda) {
      return res.status(404).json({ erro: 'Venda não encontrada' });
    }
    const { cliente, itens, formaPagamento, desconto = 0, observacoes } = req.body;
    venda.cliente = cliente || venda.cliente;
    venda.itens = itens || venda.itens;
    venda.formaPagamento = formaPagamento || venda.formaPagamento;
    venda.desconto = desconto || venda.desconto;
    venda.observacoes = observacoes || venda.observacoes;
    venda.subtotal = venda.itens.reduce((acc, item) => acc + item.subtotal, 0);
    venda.total = venda.subtotal - venda.desconto;
    await venda.save();
    await venda.populate(['vendedor', 'itens.produto']);
    res.json(venda);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// Estatísticas de vendas
export const obterEstatisticas = async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    const filtros = {
      status: { $ne: 'cancelada' }
    };

    if (dataInicio || dataFim) {
      filtros.dataVenda = {};
      if (dataInicio) filtros.dataVenda.$gte = new Date(dataInicio);
      if (dataFim) filtros.dataVenda.$lte = new Date(dataFim);
    }

    // Vendas do dia
    const vendasHoje = await Sale.aggregate([
      {
        $match: {
          dataVenda: { $gte: hoje, $lt: amanha },
          status: { $ne: 'cancelada' }
        }
      },
      {
        $group: {
          _id: null,
          totalVendas: { $sum: 1 },
          faturamentoTotal: { $sum: '$total' }
        }
      }
    ]);

    // Vendas por período (se especificado)
    const vendasPeriodo = await Sale.aggregate([
      { $match: filtros },
      {
        $group: {
          _id: null,
          totalVendas: { $sum: 1 },
          faturamentoTotal: { $sum: '$total' },
          ticketMedio: { $avg: '$total' }
        }
      }
    ]);

    // Produtos mais vendidos
    const produtosMaisVendidos = await Sale.aggregate([
      { $match: filtros },
      { $unwind: '$itens' },
      {
        $group: {
          _id: '$itens.produto',
          quantidadeVendida: { $sum: '$itens.quantidade' },
          faturamento: { $sum: '$itens.subtotal' }
        }
      },
      { $sort: { quantidadeVendida: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'produto'
        }
      },
      { $unwind: '$produto' }
    ]);

    // Vendas por forma de pagamento
    const vendasPorFormaPagamento = await Sale.aggregate([
      { $match: filtros },
      {
        $group: {
          _id: '$formaPagamento',
          quantidade: { $sum: 1 },
          valor: { $sum: '$total' }
        }
      }
    ]);

    const estatisticas = {
      hoje: vendasHoje[0] || { totalVendas: 0, faturamentoTotal: 0 },
      periodo: vendasPeriodo[0] || { totalVendas: 0, faturamentoTotal: 0, ticketMedio: 0 },
      produtosMaisVendidos,
      vendasPorFormaPagamento
    };

    res.json(estatisticas);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }


};
