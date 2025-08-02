import { useState, useEffect } from 'react';
import api from '../services/api';

export interface AppNotification {
  id: string;
  type: 'low_stock' | 'recent_sale';
  title: string;
  message: string;
  timestamp: Date;
  product?: {
    id: number;
    nome: string;
    estoque: number;
  };
  sale?: {
    id: number;
    produto: string;
    quantidade: number;
    total: number;
  };
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      
      // Carregar produtos em baixo estoque
      const produtosResponse = await api.get('/api/produtos');
      const produtos = produtosResponse.data;
      
      // Carregar vendas recentes (últimas 24 horas)
      const vendasResponse = await api.get('/api/vendas');
      const vendas = vendasResponse.data;
      
      const newNotifications: AppNotification[] = [];
      
      // Adicionar notificações de baixo estoque (estoque <= 10)
      produtos
        .filter((produto: any) => produto.estoque <= 10)
        .forEach((produto: any) => {
          newNotifications.push({
            id: `low_stock_${produto.id}`,
            type: 'low_stock',
            title: 'Baixo Estoque',
            message: `${produto.nome} - Restam apenas ${produto.estoque} unidades`,
            timestamp: new Date(),
            product: {
              id: produto.id,
              nome: produto.nome,
              estoque: produto.estoque
            }
          });
        });
      
      // Adicionar notificações de vendas recentes (últimas 24 horas)
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      vendas
        .filter((venda: any) => {
          const vendaDate = new Date(venda.createdAt || venda.data_venda);
          return vendaDate >= hoje;
        })
        .slice(0, 5) // Limitar a 5 vendas mais recentes
        .forEach((venda: any) => {
          newNotifications.push({
            id: `recent_sale_${venda.id}`,
            type: 'recent_sale',
            title: 'Venda Recente',
            message: `${venda.produto} - ${venda.quantidade} unidades - R$ ${venda.total?.toFixed(2)}`,
            timestamp: new Date(venda.createdAt || venda.data_venda),
            sale: {
              id: venda.id,
              produto: venda.produto,
              quantidade: venda.quantidade,
              total: venda.total
            }
          });
        });
      
      // Ordenar por timestamp (mais recente primeiro)
      newNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      setNotifications(newNotifications);
      setLoading(false);
      
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      
      // Notificações de exemplo em caso de erro
      const exampleNotifications: AppNotification[] = [
        {
          id: 'example_1',
          type: 'low_stock',
          title: 'Baixo Estoque',
          message: 'Água 20L - Restam apenas 5 unidades',
          timestamp: new Date(),
          product: {
            id: 1,
            nome: 'Água 20L',
            estoque: 5
          }
        },
        {
          id: 'example_2',
          type: 'recent_sale',
          title: 'Venda Recente',
          message: 'Água 20L - 2 unidades - R$ 20,00',
          timestamp: new Date(Date.now() - 60000),
          sale: {
            id: 1,
            produto: 'Água 20L',
            quantidade: 2,
            total: 20.00
          }
        }
      ];
      
      setNotifications(exampleNotifications);
      setLoading(false);
    }
  };

  const getNotificationCount = () => {
    return notifications.length;
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  useEffect(() => {
    loadNotifications();
    
    // Atualizar notificações a cada 5 minutos
    const interval = setInterval(loadNotifications, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    notifications,
    loading,
    getNotificationCount,
    markAsRead,
    clearAll,
    refresh: loadNotifications
  };
};
