import Product from '../models/Product.js';
import Sale from '../models/Sale.js';

// Criar uma nova venda
export const criarVenda = async (req, res) => {
  try {
    const { cliente, itens, formaPagamento, desconto = 0, observacoes } = req.body;
    const vendedor = req.userId;

    // Validar se todos os produtos existem e têm estoque suficiente
    for (const item of itens) {
      const produto = await Product.findOne({ _id: item.produto, ativo: true });
      if (!produto) {
        return res.status(404).json({ 
          erro: `Produto com ID ${item.produto} não encontrado ou está inativo` 
        });
      }
      
      // Verificação detalhada de estoque
      if (produto.quantidade < item.quantidade) {
        const estoqueDisponivel = produto.quantidade;
        let mensagem = `Estoque insuficiente para "${produto.nome}"`;
        
        if (estoqueDisponivel === 0) {
          mensagem += ` - Produto sem estoque`;
        } else {
          mensagem += ` - Disponível: ${estoqueDisponivel} unidade(s), solicitado: ${item.quantidade}`;
        }
        
        return res.status(400).json({ erro: mensagem });
      }
      
      item.precoUnitario = produto.preco;
      item.subtotal = item.quantidade * produto.preco;
    }

    // Criar a venda com os itens processados
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
    console.error('Erro ao criar venda:', err);
    res.status(400).json({ erro: err.message });
  }
};

// Listar todas as vendas
export const listarVendas = async (req, res) => {
  try {
    const { page, limit = 100, dataInicio, dataFim, cliente, status } = req.query;

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

    let query = Sale.find(filtros)
      .populate({
        path: 'vendedor',
        select: 'nome email ativo'
      })
      .populate({
        path: 'itens.produto',
        select: 'nome codigo marca preco ativo'
      })
      .sort({ dataVenda: -1 });

    // Se não foi especificada paginação, retornar todas as vendas
    if (!page) {
      const vendas = await query.limit(limit * 1);
      return res.json(vendas);
    }

    // Caso contrário, usar paginação
    const vendas = await query
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
      .populate({
        path: 'vendedor',
        select: 'nome email ativo'
      })
      .populate({
        path: 'itens.produto',
        select: 'nome codigo preco marca quantidade ativo'
      });

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
    
    const { cliente, itens, formaPagamento, desconto, observacoes, status } = req.body;
    
    // Se apenas status foi enviado, atualizar apenas o status
    if (status && Object.keys(req.body).length === 1) {
      venda.status = status;
      await venda.save();
      await venda.populate(['vendedor', 'itens.produto']);
      return res.json(venda);
    }
    
    // Atualização completa da venda
    if (itens && itens.length > 0) {
      // Validar se todos os produtos existem e estão ativos
      for (const item of itens) {
        const produto = await Product.findOne({ _id: item.produto, ativo: true });
        if (!produto) {
          return res.status(404).json({ 
            erro: `Produto com ID ${item.produto} não encontrado ou está inativo` 
          });
        }
      }
    }
    
    venda.cliente = cliente || venda.cliente;
    venda.itens = itens || venda.itens;
    venda.formaPagamento = formaPagamento || venda.formaPagamento;
    venda.desconto = desconto !== undefined ? desconto : venda.desconto;
    venda.observacoes = observacoes || venda.observacoes;
    if (status) venda.status = status;
    
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
      status: 'paga' // Apenas vendas pagas contam para a receita
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
          status: 'paga' // Apenas vendas pagas
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

    // Resumo por status (para dashboard completo)
    const resumoPorStatus = await Sale.aggregate([
      {
        $match: {
          ...(dataInicio || dataFim ? { dataVenda: filtros.dataVenda } : {})
        }
      },
      {
        $group: {
          _id: '$status',
          quantidade: { $sum: 1 },
          valor: { $sum: '$total' }
        }
      }
    ]);

    const estatisticas = {
      hoje: vendasHoje[0] || { totalVendas: 0, faturamentoTotal: 0 },
      periodo: vendasPeriodo[0] || { totalVendas: 0, faturamentoTotal: 0, ticketMedio: 0 },
      produtosMaisVendidos,
      vendasPorFormaPagamento,
      resumoPorStatus,
      observacao: 'Faturamento inclui apenas vendas com status PAGA',
      // Campos compatíveis com o frontend
      totalVendas: vendasPeriodo[0]?.totalVendas || 0,
      receitaTotal: vendasPeriodo[0]?.faturamentoTotal || 0,
      receitaHoje: vendasHoje[0]?.faturamentoTotal || 0,
      vendasHoje: vendasHoje[0]?.totalVendas || 0,
      vendasPorStatus: {
        pendente: resumoPorStatus.find(r => r._id === 'pendente')?.quantidade || 0,
        paga: resumoPorStatus.find(r => r._id === 'paga')?.quantidade || 0,
        cancelada: resumoPorStatus.find(r => r._id === 'cancelada')?.quantidade || 0
      },
      produtoMaisVendido: produtosMaisVendidos.length > 0 ? {
        nome: produtosMaisVendidos[0].produto?.nome || 'N/A',
        quantidade: produtosMaisVendidos[0].quantidadeVendida || 0,
        codigo: produtosMaisVendidos[0].produto?.codigo || 'N/A'
      } : null
    };

    res.json(estatisticas);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }


};
