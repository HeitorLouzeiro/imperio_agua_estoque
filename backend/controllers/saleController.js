import Product from '../models/Product.js';
import Sale from '../models/Sale.js';

// Criar uma nova venda
export const criarVenda = async (req, res) => {
  try {
    const { cliente, itens, formaPagamento, desconto = 0, observacoes } = req.body;
    const vendedor = req.userId;

    // Validar se todos os produtos existem e têm estoque suficiente
    for (const item of itens) {
      const produto = await Product.findById(item.produto);
      if (!produto) {
        return res.status(404).json({ erro: `Produto ${item.produto} não encontrado` });
      }
      if (produto.quantidade < item.quantidade) {
        return res.status(400).json({ erro: `Estoque insuficiente para ${produto.nome}. Disponível: ${produto.quantidade}` });
      }
      item.precoUnitario = produto.preco;
      item.subtotal = item.quantidade * produto.preco;
    }

    const venda = new Sale({
      cliente,
      vendedor,
      itens,
      formaPagamento,
      desconto,
      observacoes
    });

    await venda.save();

    // Atualizar estoque dos produtos
    for (const item of itens) {
      await Product.findByIdAndUpdate(
        item.produto,
        { $inc: { quantidade: -item.quantidade } }
      );
    }

    await venda.populate(['vendedor', 'itens.produto']);
    res.status(201).json(venda);
  } catch (err) {
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
