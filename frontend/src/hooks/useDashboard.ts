import { useState, useCallback } from 'react';
import { salesService, productService, userService } from '../services';
import { Product, Sale as SaleType, User } from '../types';

interface SalesChartData {
  name: string;
  vendas: number;
  produtos: number;
}

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface SaleDisplay {
  id: number;
  cliente: string;
  valor: number;
  data: string;
}

interface ProductLowStock {
  id: number;
  nome: string;
  estoque: number;
}

interface Stats {
  totalProducts: number;
  totalSales: number;
  totalUsers: number;
  totalRevenue: number;
  lowStockProducts: ProductLowStock[];
  recentSales: SaleDisplay[];
}

interface DashboardData {
  stats: Stats;
  salesData: SalesChartData[];
  pieData: PieChartData[];
  loading: boolean;
  error: string;
}

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData>({
    stats: {
      totalProducts: 0,
      totalSales: 0,
      totalUsers: 0,
      totalRevenue: 0,
      lowStockProducts: [],
      recentSales: [],
    },
    salesData: [],
    pieData: [],
    loading: true,
    error: '',
  });

  const loadDashboardData = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: '' }));
      
      // Buscar dados reais do backend
      const [
        salesStats,
        products,
        users,
        sales
      ] = await Promise.all([
        salesService.getStatistics(),
        productService.getAll(),
        userService.getUsers(),
        salesService.getAll()
      ]);

      // Produtos com estoque baixo (menos de 10 unidades)
      const lowStockProducts = products
        .filter((product: Product) => (product.quantidade || product.quantity || 0) < 10)
        .map((product: Product) => ({
          id: parseInt(product._id || product.id?.toString() || '0'),
          nome: product.nome || product.name || 'Produto sem nome',
          estoque: product.quantidade || product.quantity || 0
        }))
        .slice(0, 5); // Mostrar apenas os 5 primeiros

      // Vendas recentes (últimas 5)
      const recentSales = sales
        .filter((sale: SaleType) => sale.status === 'paga') // Apenas vendas pagas
        .sort((a: SaleType, b: SaleType) => new Date(b.dataVenda || b.createdAt).getTime() - new Date(a.dataVenda || a.createdAt).getTime())
        .slice(0, 5)
        .map((sale: SaleType) => ({
          id: parseInt(sale._id || sale.id?.toString() || '0'),
          cliente: sale.cliente || 'Cliente não informado',
          valor: sale.total || 0,
          data: new Date(sale.dataVenda || sale.createdAt).toLocaleDateString('pt-BR')
        }));

      const stats: Stats = {
        totalProducts: products.length,
        totalSales: salesStats.totalVendas || 0,
        totalUsers: users.length,
        totalRevenue: salesStats.receitaTotal || 0, // Esta receita já vem filtrada do backend
        lowStockProducts,
        recentSales,
      };

      // Gerar dados para gráfico de vendas por mês (últimos 6 meses)
      const hoje = new Date();
      const salesChartData: SalesChartData[] = [];
      
      for (let i = 5; i >= 0; i--) {
        const mes = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
        const proximoMes = new Date(hoje.getFullYear(), hoje.getMonth() - i + 1, 1);
        
        const vendasMes = sales.filter((sale: SaleType) => {
          const saleDate = new Date(sale.dataVenda || sale.createdAt);
          return saleDate >= mes && saleDate < proximoMes && sale.status === 'paga';
        });

        salesChartData.push({
          name: mes.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
          vendas: vendasMes.reduce((sum: number, sale: SaleType) => sum + (sale.total || 0), 0),
          produtos: vendasMes.reduce((sum: number, sale: SaleType) => 
            sum + (sale.itens?.reduce((itemSum, item) => itemSum + (item.quantidade || 0), 0) || 0), 0)
        });
      }

      // Gerar dados para gráfico de produtos mais vendidos
      const produtoCount: { [key: string]: { quantidade: number; nome: string } } = {};
      
      sales.forEach((sale: SaleType) => {
        if (sale.status === 'paga') {
          sale.itens?.forEach(item => {
            let produtoNome = 'Produto desconhecido';
            
            if (item.produto && typeof item.produto === 'object' && 'nome' in item.produto) {
              const produto = item.produto as Product;
              produtoNome = produto.nome || produto.name || 'Produto desconhecido';
            }
            
            if (!produtoCount[produtoNome]) {
              produtoCount[produtoNome] = { quantidade: 0, nome: produtoNome };
            }
            produtoCount[produtoNome].quantidade += item.quantidade || 0;
          });
        }
      });

      const cores = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
      const pieChartData: PieChartData[] = Object.values(produtoCount)
        .sort((a, b) => b.quantidade - a.quantidade)
        .slice(0, 5) // Top 5 produtos
        .map((produto, index) => ({
          name: produto.nome,
          value: produto.quantidade,
          color: cores[index % cores.length]
        }));

      setData({
        stats,
        salesData: salesChartData,
        pieData: pieChartData,
        loading: false,
        error: '',
      });

    } catch (err: any) {
      console.error('Erro detalhado ao carregar dados do dashboard:', err);
      console.error('Resposta do erro:', err.response?.data);
      console.error('Status do erro:', err.response?.status);
      setData(prev => ({
        ...prev,
        loading: false,
        error: `Erro ao carregar dados do dashboard: ${err.message}`,
      }));
    }
  }, []);

  return {
    ...data,
    loadDashboardData,
  };
};
