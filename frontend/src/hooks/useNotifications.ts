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

  // Função para obter notificações marcadas como lidas do localStorage
  const getReadNotifications = (): string[] => {
    try {
      const readNotifications = localStorage.getItem('readNotifications');
      return readNotifications ? JSON.parse(readNotifications) : [];
    } catch {
      return [];
    }
  };

  // Função para salvar notificação como lida
  const saveAsRead = (notificationId: string): void => {
    try {
      const readNotifications = getReadNotifications();
      if (!readNotifications.includes(notificationId)) {
        readNotifications.push(notificationId);
        localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
      }
    } catch (error) {
      console.error('Erro ao salvar notificação como lida:', error);
    }
  };

  // Função para limpar notificações lidas do localStorage
  const clearReadNotifications = (): void => {
    try {
      localStorage.removeItem('readNotifications');
    } catch (error) {
      console.error('Erro ao limpar notificações lidas:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      
      // Carregar produtos em baixo estoque
      const produtosResponse = await api.get('/produtos');
      const produtos = produtosResponse.data;
      
      // Carregar vendas recentes (últimas 24 horas)
      const vendasResponse = await api.get('/vendas');
      const vendas = vendasResponse.data;
      
      const newNotifications: AppNotification[] = [];
      
      // Adicionar notificações de baixo estoque (estoque <= 10)
      produtos
        .filter((produto: any) => (produto.quantidade || 0) <= 10)
        .forEach((produto: any) => {
          newNotifications.push({
            id: `low_stock_${produto._id || produto.id}`,
            type: 'low_stock',
            title: 'Baixo Estoque',
            message: `${produto.nome} - Restam apenas ${produto.quantidade || 0} unidades`,
            timestamp: new Date(),
            product: {
              id: produto._id || produto.id,
              nome: produto.nome,
              estoque: produto.quantidade || 0
            }
          });
        });
      
      // Adicionar notificações de vendas recentes (últimas 24 horas)
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      vendas
        .filter((venda: any) => {
          const vendaDate = new Date(venda.dataVenda || venda.createdAt);
          return vendaDate >= hoje && venda.status === 'paga';
        })
        .slice(0, 5) // Limitar a 5 vendas mais recentes
        .forEach((venda: any) => {
          // Extrair nome do primeiro produto da venda
          let produtoNome = 'Produtos diversos';
          if (venda.itens && venda.itens.length > 0) {
            const primeiroItem = venda.itens[0];
            if (primeiroItem.produto && typeof primeiroItem.produto === 'object') {
              produtoNome = primeiroItem.produto.nome || 'Produto';
            }
            if (venda.itens.length > 1) {
              produtoNome += ` e mais ${venda.itens.length - 1} item(s)`;
            }
          }
          
          const totalItens = venda.itens?.reduce((total: number, item: any) => total + (item.quantidade || 0), 0) || 0;
          
          newNotifications.push({
            id: `recent_sale_${venda._id || venda.id}`,
            type: 'recent_sale',
            title: 'Venda Recente',
            message: `${produtoNome} - ${totalItens} unidades - R$ ${(venda.total || 0).toFixed(2)}`,
            timestamp: new Date(venda.dataVenda || venda.createdAt),
            sale: {
              id: venda._id || venda.id,
              produto: produtoNome,
              quantidade: totalItens,
              total: venda.total || 0
            }
          });
        });
      
      // Ordenar por timestamp (mais recente primeiro)
      newNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      // Filtrar notificações já lidas
      const readNotifications = getReadNotifications();
      const unreadNotifications = newNotifications.filter(notification => 
        !readNotifications.includes(notification.id)
      );
      
      setNotifications(unreadNotifications);
      setLoading(false);
      
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      setNotifications([]);
      setLoading(false);
    }
  };

  const getNotificationCount = () => {
    return notifications.length;
  };

  const markAsRead = (notificationId: string) => {
    saveAsRead(notificationId);
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const clearAll = () => {
    // Marcar todas as notificações atuais como lidas
    notifications.forEach(notification => {
      saveAsRead(notification.id);
    });
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
