import { useState, useCallback } from 'react';
import { salesService, productService, userService } from '../services';
import { Product, Sale as SaleType } from '../types';

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

  const loadDashboardData = useCallback(async (startDate?: Date, endDate?: Date) => {
    try {
      setData(prev => ({ ...prev, loading: true, error: '' }));
      
      // Buscar dados reais do backend
      const [
        products,
        users,
        sales
      ] = await Promise.all([
        productService.getAll(),
        userService.getUsers(),
        salesService.getAll()
      ]);

      // Filtrar vendas por período se fornecido
      let filteredSales = sales;
      if (startDate && endDate) {
        filteredSales = sales.filter((sale: SaleType) => {
          const saleDate = new Date(sale.dataVenda || sale.createdAt);
          return saleDate >= startDate && saleDate <= endDate;
        });
      }

      // Produtos com estoque baixo (menos de 10 unidades)
      const lowStockProducts = products
        .filter((product: Product) => (product.quantidade || product.quantity || 0) < 10)
        .map((product: Product) => ({
          id: parseInt(product._id || product.id?.toString() || '0'),
          nome: product.nome || product.name || 'Produto sem nome',
          estoque: product.quantidade || product.quantity || 0
        }))
        .slice(0, 5); // Mostrar apenas os 5 primeiros

      // Vendas recentes (últimas 5) - usando vendas filtradas
      const recentSales = filteredSales
        .filter((sale: SaleType) => sale.status === 'paga') // Apenas vendas pagas
        .sort((a: SaleType, b: SaleType) => new Date(b.dataVenda || b.createdAt).getTime() - new Date(a.dataVenda || a.createdAt).getTime())
        .slice(0, 5)
        .map((sale: SaleType) => ({
          id: parseInt(sale._id || sale.id?.toString() || '0'),
          cliente: sale.cliente || 'Cliente não informado',
          valor: sale.total || 0,
          data: new Date(sale.dataVenda || sale.createdAt).toLocaleDateString('pt-BR')
        }));

      // Calcular estatísticas baseadas no período filtrado
      const totalSalesFiltered = filteredSales.filter((sale: SaleType) => sale.status === 'paga').length;
      const totalRevenueFiltered = filteredSales
        .filter((sale: SaleType) => sale.status === 'paga')
        .reduce((sum: number, sale: SaleType) => sum + (sale.total || 0), 0);

      const stats: Stats = {
        totalProducts: products.length,
        totalSales: totalSalesFiltered,
        totalUsers: users.length,
        totalRevenue: totalRevenueFiltered,
        lowStockProducts,
        recentSales,
      };

      // Gerar dados para gráfico de vendas por período
      const salesChartData: SalesChartData[] = [];
      
      if (startDate && endDate) {
        // Se há filtro de período, dividir em intervalos menores
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 31) {
          // Gráfico por dias se período for até 1 mês
          for (let i = 0; i < diffDays; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const nextDate = new Date(currentDate);
            nextDate.setDate(currentDate.getDate() + 1);
            
            const vendasDia = filteredSales.filter((sale: SaleType) => {
              const saleDate = new Date(sale.dataVenda || sale.createdAt);
              return saleDate >= currentDate && saleDate < nextDate && sale.status === 'paga';
            });

            salesChartData.push({
              name: currentDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
              vendas: vendasDia.reduce((sum: number, sale: SaleType) => sum + (sale.total || 0), 0),
              produtos: vendasDia.reduce((sum: number, sale: SaleType) => 
                sum + (sale.itens?.reduce((itemSum, item) => itemSum + (item.quantidade || 0), 0) || 0), 0)
            });
          }
        } else {
          // Gráfico por meses se período for maior que 1 mês
          const startMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
          const endMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
          
          let currentMonth = new Date(startMonth);
          while (currentMonth <= endMonth) {
            const currentMonthStart = new Date(currentMonth);
            const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
            
            const vendasMes = filteredSales.filter((sale: SaleType) => {
              const saleDate = new Date(sale.dataVenda || sale.createdAt);
              return saleDate >= currentMonthStart && saleDate < nextMonth && sale.status === 'paga';
            });

            salesChartData.push({
              name: currentMonthStart.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }).replace('.', ''),
              vendas: vendasMes.reduce((sum: number, sale: SaleType) => sum + (sale.total || 0), 0),
              produtos: vendasMes.reduce((sum: number, sale: SaleType) => 
                sum + (sale.itens?.reduce((itemSum, item) => itemSum + (item.quantidade || 0), 0) || 0), 0)
            });
            
            currentMonth = nextMonth;
          }
        }
      } else {
        // Gráfico padrão dos últimos 6 meses
        const hoje = new Date();
        
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
      }

      // Gerar dados para gráfico de produtos mais vendidos (baseado no período filtrado)
      const produtoCount: { [key: string]: { quantidade: number; nome: string } } = {};
      
      filteredSales.forEach((sale: SaleType) => {
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
