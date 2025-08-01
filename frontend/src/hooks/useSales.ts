import { useState, useCallback } from 'react';
import { salesService } from '../services';
import { Sale, Product, SaleStatistics } from '../types';

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statistics, setStatistics] = useState<SaleStatistics>({
    totalVendas: 0,
    vendasHoje: 0,
    receitaTotal: 0,
    receitaHoje: 0,
    vendasPorStatus: { pendente: 0, paga: 0, cancelada: 0 },
    produtoMaisVendido: null
  });

  const calculateStatistics = useCallback((salesData: Sale[]) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const stats: SaleStatistics = {
      totalVendas: salesData.length,
      vendasHoje: 0,
      receitaTotal: 0,
      receitaHoje: 0,
      vendasPorStatus: { pendente: 0, paga: 0, cancelada: 0 },
      produtoMaisVendido: null
    };

    const produtosCount: { [key: string]: { quantidade: number; codigo?: string; nome: string } } = {};

    salesData.forEach(sale => {
      // Contar vendas por status
      const status = sale.status || 'paga';
      if (status in stats.vendasPorStatus) {
        stats.vendasPorStatus[status as keyof typeof stats.vendasPorStatus]++;
      }
      
      // Receita total - apenas para vendas PAGAS
      if (sale.status === 'paga') {
        stats.receitaTotal += sale.total || 0;
      }
      
      // Vendas de hoje
      const saleDate = new Date(sale.dataVenda || sale.createdAt);
      saleDate.setHours(0, 0, 0, 0);
      
      if (saleDate.getTime() === hoje.getTime()) {
        stats.vendasHoje++;
        // Receita de hoje - apenas para vendas PAGAS
        if (sale.status === 'paga') {
          stats.receitaHoje += sale.total || 0;
        }
      }

      // Contar produtos mais vendidos APENAS para vendas PAGAS
      if (sale.status === 'paga') {
        sale.itens?.forEach(item => {
          let produtoNome = 'Produto desconhecido';
          let produtoCodigo = '';
          
          // Verificar se o produto foi populado corretamente no item.produto
          if (item.produto && typeof item.produto === 'object' && 'nome' in item.produto) {
            const produto = item.produto as Product;
            produtoNome = produto.nome || produto.name || 'Produto desconhecido';
            produtoCodigo = produto.codigo || '';
          }
          // Se não, usar dados processados no item.product
          else if (item.product && typeof item.product === 'object') {
            produtoNome = item.product.nome || item.product.name || 'Produto desconhecido';
            produtoCodigo = item.product.codigo || '';
          }
          // Se não, usar o nome direto do item
          else if (item.nome && item.nome !== 'Produto') {
            produtoNome = item.nome;
          }
          
          // Só contar se temos um nome válido
          if (produtoNome && produtoNome !== 'Produto desconhecido' && produtoNome !== 'Produto') {
            if (!produtosCount[produtoNome]) {
              produtosCount[produtoNome] = {
                quantidade: 0,
                codigo: produtoCodigo,
                nome: produtoNome
              };
            }
            produtosCount[produtoNome].quantidade += item.quantidade || 0;
          }
        });
      }
    });

    // Encontrar produto mais vendido
    const produtoMaisVendido = Object.entries(produtosCount).reduce(
      (max, [nomeProduto, dados]) => 
        dados.quantidade > max.quantidade ? { 
          nome: dados.nome, 
          quantidade: dados.quantidade,
          codigo: dados.codigo || 'S/C'
        } : max,
      { nome: '', quantidade: 0, codigo: '' }
    );

    stats.produtoMaisVendido = produtoMaisVendido.nome ? produtoMaisVendido : null;
    
    setStatistics(stats);
  }, []);

  const loadSales = useCallback(async (products: Product[]) => {
    try {
      setLoading(true);
      const response = await salesService.getAll();
      
      const salesWithId = response.map(sale => ({
        ...sale,
        id: sale._id || sale.id,
        // Garantir que os itens tenham os nomes dos produtos
        itens: sale.itens?.map(item => {
          // A estrutura do backend populado: item.produto pode ser um objeto com dados completos
          let nomeItem = 'Produto';
          let codigoItem = '';
          
          // Verificar se item.produto está populado (é um objeto)
          if (item.produto && typeof item.produto === 'object' && 'nome' in item.produto) {
            const produto = item.produto as Product;
            nomeItem = produto.nome || produto.name || 'Produto';
            codigoItem = produto.codigo || '';
          }
          // Fallback: Se não está populado, tentar buscar pelo ID nos produtos carregados
          else if (typeof item.produto === 'string' && products.length > 0) {
            const produtoEncontrado = products.find(p => 
              (p.id === item.produto) || (p._id === item.produto)
            );
            if (produtoEncontrado) {
              nomeItem = produtoEncontrado.nome || produtoEncontrado.name || 'Produto';
              codigoItem = produtoEncontrado.codigo || '';
            }
          }
          
          return {
            ...item,
            nome: nomeItem,
            produto: item.produto,
            // Manter a estrutura original do produto populado
            product: {
              nome: nomeItem,
              name: nomeItem,
              codigo: codigoItem,
              id: typeof item.produto === 'object' && 'id' in item.produto ? 
                  item.produto.id || item.produto._id : 
                  item.produto
            }
          };
        }) || []
      }));
      setSales(salesWithId);
      calculateStatistics(salesWithId);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [calculateStatistics]);

  const updateSaleStatus = useCallback(async (id: string, status: string) => {
    try {
      await salesService.updateStatus(id, status);
      setSales(prevSales => 
        prevSales.map(sale => 
          sale.id === id ? { ...sale, status: status as any } : sale
        )
      );
      // Recalcular estatísticas
      const updatedSales = sales.map(sale => 
        sale.id === id ? { ...sale, status: status as any } : sale
      );
      calculateStatistics(updatedSales);
    } catch (error) {
      throw error;
    }
  }, [sales, calculateStatistics]);

  return {
    sales,
    loading,
    statistics,
    loadSales,
    updateSaleStatus,
    setSales
  };
};
