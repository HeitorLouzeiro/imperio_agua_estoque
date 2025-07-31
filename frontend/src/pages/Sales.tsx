import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  Card,
  InputAdornment,
  Autocomplete,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
} from '@mui/material';
import { DataGrid, GridSearchIcon, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
  Share as ShareIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { salesService, productService } from '../services';
import Layout from '../components/common/Layout';
import { 
  Sale, 
  Product, 
  SaleItem, 
  SaleFormData, 
  SaleStatistics, 
  CreateSalePayload,
  SnackbarState 
} from '../types';

const Sales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: '', severity: 'success' });
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [statistics, setStatistics] = useState<SaleStatistics>({
    totalVendas: 0,
    vendasHoje: 0,
    receitaTotal: 0,
    receitaHoje: 0,
    vendasPorStatus: { pendente: 0, paga: 0, cancelada: 0 },
    produtoMaisVendido: null
  });

  // Dados para nova venda
  const [saleData, setSaleData] = useState<SaleFormData>({
    cliente: '',
    data: new Date(),
    observacoes: '',
    formaPagamento: 'dinheiro',
    desconto: 0,
  });
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // Carregar vendas da API
  const loadSales = useCallback(async () => {
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
      showSnackbar('Erro ao carregar vendas', 'error');
    } finally {
      setLoading(false);
    }
  }, [products]);

  // Carregar produtos da API
  const loadProducts = useCallback(async () => {
    try {
      const response = await productService.getAll();
      const productsWithId = response.map(prod => ({
        ...prod,
        id: prod._id || prod.id,
      }));
      setProducts(productsWithId);
    } catch (error) {
      showSnackbar('Erro ao carregar produtos', 'error');
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (products.length > 0) {
      loadSales();
    }
  }, [loadSales, products]);

  // Calcular estatísticas das vendas
  const calculateStatistics = (salesData: Sale[]) => {
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
      
      // Receita total
      stats.receitaTotal += sale.total || 0;
      
      // Vendas de hoje
      const saleDate = new Date(sale.dataVenda || sale.createdAt);
      saleDate.setHours(0, 0, 0, 0);
      
      if (saleDate.getTime() === hoje.getTime()) {
        stats.vendasHoje++;
        stats.receitaHoje += sale.total || 0;
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
  };

  // Filtrar vendas baseado nos critérios de pesquisa
  const filteredSales = sales.filter(sale => {
    const matchesSearch = searchTerm === '' || 
      sale.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.numero?.toString().includes(searchTerm) ||
      sale.vendedor?.nome?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = !dateFilter || 
      new Date(sale.dataVenda || sale.createdAt).toDateString() === dateFilter.toDateString();

    return matchesSearch && matchesDate;
  });

  // Mostrar Snackbar
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Abrir modal nova venda
  const handleNewSale = () => {
    setSaleData({
      cliente: '',
      data: new Date(),
      observacoes: '',
      formaPagamento: 'dinheiro',
      desconto: 0,
    });
    setSaleItems([]);
    setSelectedProduct(null);
    setQuantity(1);
    setOpen(true);
  };

  // Adicionar item na venda
  const handleAddItem = () => {
    if (!selectedProduct || quantity <= 0) {
      showSnackbar('Selecione um produto e defina quantidade válida', 'error');
      return;
    }

    const existingIndex = saleItems.findIndex(item => item.produto === selectedProduct.id);

    if (existingIndex >= 0) {
      const updated = [...saleItems];
      updated[existingIndex].quantidade += quantity;
      updated[existingIndex].subtotal = updated[existingIndex].quantidade * updated[existingIndex].precoUnitario;
      setSaleItems(updated);
    } else {
      setSaleItems([
        ...saleItems,
        {
          produto: selectedProduct.id,
          nome: selectedProduct.nome || selectedProduct.name || 'Produto',
          quantidade: quantity,
          precoUnitario: selectedProduct.preco || selectedProduct.price || 0,
          subtotal: (selectedProduct.preco || selectedProduct.price || 0) * quantity,
        },
      ]);
    }

    setSelectedProduct(null);
    setQuantity(1);
  };

  // Remover item da venda
  const handleRemoveItem = (index: number) => {
    setSaleItems(saleItems.filter((_, i) => i !== index));
  };

  // Calcular total da venda
  const calculateSubtotal = () => {
    return saleItems.reduce((acc, item) => acc + item.subtotal, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - (saleData.desconto || 0);
  };

  // Salvar venda na API
  const handleSaveSale = async () => {
    if (!saleData.cliente) {
      showSnackbar('Informe o nome do cliente', 'error');
      return;
    }
    if (saleItems.length === 0) {
      showSnackbar('Adicione pelo menos um produto', 'error');
      return;
    }
    try {
      const payload: CreateSalePayload = {
        cliente: saleData.cliente,
        formaPagamento: saleData.formaPagamento,
        desconto: saleData.desconto || 0,
        observacoes: saleData.observacoes,
        itens: saleItems.map(item => ({
          produto: (typeof item.produto === 'object' && 'id' in item.produto ? 
                   (item.produto.id || item.produto._id) : 
                   item.produto) as string | number,            // ID do produto
          quantidade: item.quantidade
          // precoUnitario e subtotal serão calculados no backend
        }))
      };

      await salesService.create(payload as any);
      showSnackbar('Venda registrada com sucesso!', 'success');
      setOpen(false);
      loadSales(); // Isso irá recalcular as estatísticas também
    } catch (error: any) {
      console.error('Erro ao criar venda:', error.response?.data || error.message);
      
      // Verificar se é um erro de estoque insuficiente
      if (error.response?.data?.erro) {
        showSnackbar(error.response.data.erro, 'error');
      } else if (error.response?.data?.message) {
        showSnackbar(error.response.data.message, 'error');
      } else {
        showSnackbar('Erro ao criar venda', 'error');
      }
    }
  };

  // Visualizar detalhes da venda
  const handleViewSale = (sale: Sale) => {
    setSelectedSale(sale);
    setViewDialogOpen(true);
  };

  // Imprimir recibo
  const handlePrintReceipt = (sale: Sale) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const receiptHTML = generateReceiptHTML(sale);
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Compartilhar recibo
  const handleShareReceipt = async (sale: Sale) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Recibo - ${sale.numero}`,
          text: `Recibo da venda para ${sale.cliente} - Total: R$ ${sale.total?.toFixed(2)}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
        copyReceiptToClipboard(sale);
      }
    } else {
      copyReceiptToClipboard(sale);
    }
  };

  // Copiar recibo para área de transferência
  const copyReceiptToClipboard = (sale: Sale) => {
    const receiptText = generateReceiptText(sale);
    navigator.clipboard.writeText(receiptText).then(() => {
      showSnackbar('Recibo copiado para a área de transferência!', 'success');
    }).catch(() => {
      showSnackbar('Erro ao copiar recibo', 'error');
    });
  };

  // Gerar texto do recibo para compartilhamento
  const generateReceiptText = (sale: Sale) => {
    const itensText = sale.itens?.map(item => {
      const nomeProduto = item.product?.nome || item.product?.name || item.nome || 'Produto';
      const codigoProduto = item.product?.codigo ? ` (${item.product.codigo})` : '';
      return `${nomeProduto}${codigoProduto} - Qtd: ${item.quantidade} - R$ ${item.precoUnitario?.toFixed(2)} = R$ ${item.subtotal?.toFixed(2)}`;
    }).join('\n') || '';

    return `
🧾 RECIBO - IMPÉRIO ÁGUA
━━━━━━━━━━━━━━━━━━━━━━━━

📄 Número: ${sale.numero || 'N/A'}
📅 Data: ${new Date(sale.dataVenda || sale.createdAt).toLocaleDateString('pt-BR')}
👤 Cliente: ${sale.cliente}
💳 Pagamento: ${sale.formaPagamento}
📊 Status: ${sale.status}

📦 ITENS:
${itensText}

━━━━━━━━━━━━━━━━━━━━━━━━
💰 Subtotal: R$ ${sale.subtotal?.toFixed(2) || '0.00'}
🏷️ Desconto: R$ ${sale.desconto?.toFixed(2) || '0.00'}
💵 TOTAL: R$ ${sale.total?.toFixed(2) || '0.00'}

${sale.observacoes ? `📝 Obs: ${sale.observacoes}` : ''}

Obrigado pela preferência! 🙏
    `.trim();
  };

  // Gerar HTML do recibo
  const generateReceiptHTML = (sale: Sale) => {
    const itensHTML = sale.itens?.map(item => {
      const nomeProduto = item.product?.nome || item.product?.name || item.nome || 'Produto';
      const codigoProduto = item.product?.codigo ? ` (${item.product.codigo})` : '';
      return `
      <tr>
        <td>${nomeProduto}${codigoProduto}</td>
        <td>${item.quantidade}</td>
        <td>R$ ${item.precoUnitario?.toFixed(2) || '0.00'}</td>
        <td>R$ ${item.subtotal?.toFixed(2) || '0.00'}</td>
      </tr>
    `;
    }).join('') || '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Recibo - Império Água</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1976d2; padding-bottom: 15px; }
          .company-name { font-size: 28px; font-weight: bold; color: #1976d2; margin-bottom: 5px; }
          .company-subtitle { font-size: 14px; color: #666; }
          .receipt-info { margin-bottom: 25px; background: #f5f5f5; padding: 15px; border-radius: 8px; }
          .info-row { display: flex; justify-content: space-between; margin: 8px 0; }
          .info-label { font-weight: bold; color: #333; }
          table { width: 100%; border-collapse: collapse; margin: 25px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #1976d2; color: white; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .totals { margin-top: 25px; padding: 15px; background: #f0f8ff; border-radius: 8px; }
          .total-row { display: flex; justify-content: space-between; margin: 8px 0; font-size: 16px; }
          .final-total { font-size: 20px; font-weight: bold; color: #1976d2; border-top: 2px solid #1976d2; padding-top: 10px; }
          .observations { margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 15px; }
          .status-badge { 
            display: inline-block; 
            padding: 4px 12px; 
            border-radius: 20px; 
            font-size: 12px; 
            font-weight: bold; 
            color: white;
            background: ${sale.status === 'paga' ? '#4caf50' : sale.status === 'pendente' ? '#ff9800' : '#f44336'};
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">IMPÉRIO ÁGUA</div>
          <div class="company-subtitle">Sistema de Controle de Estoque</div>
        </div>
        
        <div class="receipt-info">
          <div class="info-row">
            <span><span class="info-label">Número da Venda:</span> ${sale.numero || 'N/A'}</span>
            <span><span class="info-label">Data:</span> ${new Date(sale.dataVenda || sale.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>
          <div class="info-row">
            <span><span class="info-label">Cliente:</span> ${sale.cliente}</span>
            <span><span class="info-label">Status:</span> <span class="status-badge">${sale.status?.toUpperCase()}</span></span>
          </div>
          <div class="info-row">
            <span><span class="info-label">Forma de Pagamento:</span> ${sale.formaPagamento}</span>
            <span><span class="info-label">Vendedor:</span> ${sale.vendedor?.nome || 'Sistema'}</span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Preço Unitário</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itensHTML}
          </tbody>
        </table>

        <div class="totals">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>R$ ${sale.subtotal?.toFixed(2) || '0.00'}</span>
          </div>
          <div class="total-row">
            <span>Desconto:</span>
            <span>R$ ${sale.desconto?.toFixed(2) || '0.00'}</span>
          </div>
          <div class="total-row final-total">
            <span>TOTAL:</span>
            <span>R$ ${sale.total?.toFixed(2) || '0.00'}</span>
          </div>
        </div>

        ${sale.observacoes ? `<div class="observations"><strong>Observações:</strong> ${sale.observacoes}</div>` : ''}

        <div class="footer">
          <div>Obrigado pela preferência!</div>
          <div>Recibo gerado em ${new Date().toLocaleString('pt-BR')}</div>
        </div>
      </body>
      </html>
    `;
  };

  // Alterar status da venda
  const handleChangeStatus = (sale: Sale) => {
    setSelectedSale(sale);
    setNewStatus(sale.status || 'paga');
    setStatusDialogOpen(true);
  };

  // Salvar novo status
  const handleSaveStatus = async () => {
    if (!selectedSale) return;
    try {
      // Use o ID original sem conversão, pois o backend espera ObjectId (string)
      const saleId = selectedSale._id || selectedSale.id;
      await salesService.updateStatus(saleId, newStatus);
      showSnackbar('Status atualizado com sucesso!', 'success');
      setStatusDialogOpen(false);
      loadSales(); // Isso irá recalcular as estatísticas também
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      const errorMessage = error.response?.data?.erro || error.response?.data?.message || 'Erro ao atualizar status';
      showSnackbar(errorMessage, 'error');
    }
  };

  // Colunas para DataGrid
  const columns: GridColDef[] = [
    { field: 'cliente', headerName: 'Cliente', width: 200 },
    {
      field: 'dataVenda',
      headerName: 'Data',
      width: 130,
      valueGetter: (params) => params.row.dataVenda || params.row.data,
      renderCell: (params: GridRenderCellParams) => {
        const date = params.value ? new Date(params.value) : null;
        return date ? date.toLocaleDateString('pt-BR') : '';
      },
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" fontWeight="bold" color="success.main">
          R$ {params.value?.toFixed(2)}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value || 'paga'}
          color={params.value === 'paga' ? 'success' : params.value === 'pendente' ? 'warning' : 'error'}
          size="small"
          onClick={() => handleChangeStatus(params.row)}
          sx={{ cursor: 'pointer' }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 180,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="Ver Detalhes">
            <IconButton size="small" onClick={() => handleViewSale(params.row)}>
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Imprimir Recibo">
            <IconButton size="small" onClick={() => handlePrintReceipt(params.row)}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Compartilhar">
            <IconButton size="small" onClick={() => handleShareReceipt(params.row)}>
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Alterar Status">
            <IconButton size="small" onClick={() => handleChangeStatus(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Layout>
      <Box>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Vendas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gerencie as vendas e faturamento da empresa
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleNewSale} sx={{ borderRadius: 2 }}>
            Nova Venda
          </Button>
        </Box>

        {/* Filtros de Pesquisa */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Filtros de Pesquisa
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                label="Pesquisar"
                placeholder="Cliente, número da venda ou vendedor..."
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <GridSearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Filtrar por Data"
                value={dateFilter}
                onChange={(newValue) => setDateFilter(newValue)}
                slotProps={{ 
                  textField: { 
                    fullWidth: true,
                    placeholder: "Selecione uma data"
                  } 
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  setSearchTerm('');
                  setDateFilter(null);
                }}
                sx={{ height: '56px', borderRadius: 2 }}
              >
                Limpar
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabela de vendas */}
        <Paper sx={{ height: 440, width: '100%', mb: 3 }}>
          <DataGrid
            rows={filteredSales}
            columns={columns}
            loading={loading}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 8, page: 0 },
              },
            }}
            pageSizeOptions={[8, 16]}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
          />
        </Paper>

        {/* Estatísticas das Vendas */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
            Estatísticas das Vendas
          </Typography>
          
          <Grid container spacing={3}>
            {/* Vendas Totais */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <Typography variant="h3" fontWeight="bold">
                  {statistics.totalVendas}
                </Typography>
                <Typography variant="body1">
                  Total de Vendas
                </Typography>
              </Card>
            </Grid>

            {/* Vendas Hoje */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                <Typography variant="h3" fontWeight="bold">
                  {statistics.vendasHoje}
                </Typography>
                <Typography variant="body1">
                  Vendas Hoje
                </Typography>
              </Card>
            </Grid>

            {/* Receita Total */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                <Typography variant="h3" fontWeight="bold">
                  R$ {statistics.receitaTotal.toFixed(2)}
                </Typography>
                <Typography variant="body1">
                  Receita Total
                </Typography>
              </Card>
            </Grid>

            {/* Receita Hoje */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
                <Typography variant="h3" fontWeight="bold">
                  R$ {statistics.receitaHoje.toFixed(2)}
                </Typography>
                <Typography variant="body1">
                  Receita Hoje
                </Typography>
              </Card>
            </Grid>

            {/* Status das Vendas */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Vendas por Status
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip label="Paga" color="success" size="small" sx={{ mr: 2 }} />
                      <Typography variant="body2">Pagas</Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="bold" color="success.main">
                      {statistics.vendasPorStatus.paga || 0}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip label="Pendente" color="warning" size="small" sx={{ mr: 2 }} />
                      <Typography variant="body2">Pendentes</Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="bold" color="warning.main">
                      {statistics.vendasPorStatus.pendente || 0}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip label="Cancelada" color="error" size="small" sx={{ mr: 2 }} />
                      <Typography variant="body2">Canceladas</Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="bold" color="error.main">
                      {statistics.vendasPorStatus.cancelada || 0}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Produto Mais Vendido */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Produto Mais Vendido
                </Typography>
                {statistics.produtoMaisVendido ? (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                      {statistics.produtoMaisVendido.quantidade}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      unidades vendidas
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
                      {statistics.produtoMaisVendido.nome}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Código: {statistics.produtoMaisVendido.codigo}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
                    Nenhum produto vendido ainda
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Modal de nova venda */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Nova Venda</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Cliente"
                  fullWidth
                  value={saleData.cliente}
                  onChange={(e) => setSaleData({ ...saleData, cliente: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Data da Venda"
                  value={saleData.data}
                  onChange={(newValue) => setSaleData({ ...saleData, data: newValue })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={products}
                  getOptionLabel={(option) => `${option.nome} - ${option.codigo || 'S/C'} - ${option.marca || 'S/M'}`}
                  value={selectedProduct}
                  onChange={(event, newValue) => setSelectedProduct(newValue)}
                  renderInput={(params) => <TextField {...params} label="Produto (Nome, Código ou Marca)" fullWidth />}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {option.nome}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Código: {option.codigo || 'N/A'} | Marca: {option.marca || 'N/A'} | R$ {option.preco?.toFixed(2) || '0.00'}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  filterOptions={(options, { inputValue }) => {
                    const searchTerm = inputValue.toLowerCase();
                    return options.filter(option => 
                      option.nome?.toLowerCase().includes(searchTerm) ||
                      option.codigo?.toLowerCase().includes(searchTerm) ||
                      option.marca?.toLowerCase().includes(searchTerm)
                    );
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField
                  label="Quantidade"
                  type="number"
                  fullWidth
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  inputProps={{ min: 1 }}
                  placeholder="1"
                />
              </Grid>
              <Grid item xs={6} md={2} display="flex" alignItems="center">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddItem}
                  disabled={!selectedProduct || quantity < 1}
                >
                  Adicionar
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                {saleItems.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" align="center">
                    Nenhum produto adicionado
                  </Typography>
                ) : (
                  <List>
                    {saleItems.map((item, index) => (
                      <ListItem key={index} divider>
                        <ListItemText
                          primary={`${item.nome} - Quantidade: ${item.quantidade}`}
                          secondary={`Preço Unitário: R$ ${item.precoUnitario.toFixed(2)} | Subtotal: R$ ${item.subtotal.toFixed(2)}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" color="error" onClick={() => handleRemoveItem(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
                {saleItems.length > 0 && (
                  <Box sx={{ mt: 1, textAlign: 'right' }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Subtotal: R$ {calculateSubtotal().toFixed(2)}
                    </Typography>
                    <TextField
                      label="Desconto"
                      type="number"
                      size="small"
                      sx={{ mt: 1, width: 150 }}
                      value={saleData.desconto || ''}
                      onChange={(e) => setSaleData({ ...saleData, desconto: Number(e.target.value) || 0 })}
                      inputProps={{ min: 0 }}
                      placeholder="0.00"
                    />
                    <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
                      Total: R$ {calculateTotal().toFixed(2)}
                    </Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Forma de Pagamento"
                  select
                  fullWidth
                  value={saleData.formaPagamento}
                  onChange={(e) => setSaleData({ ...saleData, formaPagamento: e.target.value })}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="dinheiro">Dinheiro</option>
                  <option value="cartao_debito">Cartão Débito</option>
                  <option value="cartao_credito">Cartão Crédito</option>
                  <option value="pix">Pix</option>
                  <option value="transferencia">Transferência</option>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Observações"
                  fullWidth
                  multiline
                  minRows={2}
                  value={saleData.observacoes}
                  onChange={(e) => setSaleData({ ...saleData, observacoes: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleSaveSale}>
              Salvar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal de visualização da venda */}
        <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Detalhes da Venda</Typography>
              <Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PrintIcon />}
                  onClick={() => selectedSale && handlePrintReceipt(selectedSale)}
                  sx={{ mr: 1 }}
                >
                  Imprimir
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ShareIcon />}
                  onClick={() => selectedSale && handleShareReceipt(selectedSale)}
                  sx={{ mr: 1 }}
                >
                  Compartilhar
                </Button>
                <IconButton onClick={() => setViewDialogOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedSale && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Número da Venda</Typography>
                  <Typography variant="body1" fontWeight="bold">{selectedSale.numero || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Data da Venda</Typography>
                  <Typography variant="body1">
                    {new Date(selectedSale.dataVenda || selectedSale.createdAt).toLocaleDateString('pt-BR')}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Cliente</Typography>
                  <Typography variant="body1">{selectedSale.cliente}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip
                    label={selectedSale.status}
                    color={selectedSale.status === 'paga' ? 'success' : selectedSale.status === 'pendente' ? 'warning' : 'error'}
                    size="small"
                    onClick={() => handleChangeStatus(selectedSale)}
                    sx={{ cursor: 'pointer' }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Forma de Pagamento</Typography>
                  <Typography variant="body1">{selectedSale.formaPagamento}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Vendedor</Typography>
                  <Typography variant="body1">{selectedSale.vendedor?.nome || 'N/A'}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>Itens da Venda</Typography>
                  <List>
                    {selectedSale.itens?.map((item, index) => (
                      <ListItem key={index} divider>
                        <ListItemText
                          primary={
                            <Box>
                              <Typography variant="body1" fontWeight="bold">
                                {(typeof item.produto === 'object' && 'nome' in item.produto ? item.produto.nome : null) || 
                                 item.product?.name || 
                                 item.nome || 
                                 'Produto'} - Quantidade: {item.quantidade}
                              </Typography>
                              {(item.product?.codigo) && (
                                <Typography variant="body2" color="text.secondary">
                                  Código: {item.product.codigo}
                                </Typography>
                              )}
                            </Box>
                          }
                          secondary={`Preço Unitário: R$ ${item.precoUnitario?.toFixed(2) || '0.00'} | Subtotal: R$ ${item.subtotal?.toFixed(2) || '0.00'}`}
                        />
                      </ListItem>
                    )) || <Typography variant="body2" color="text.secondary">Nenhum item encontrado</Typography>}
                  </List>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="subtitle1">
                      Subtotal: R$ {selectedSale.subtotal?.toFixed(2) || '0.00'}
                    </Typography>
                    <Typography variant="subtitle1">
                      Desconto: R$ {selectedSale.desconto?.toFixed(2) || '0.00'}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="success.main">
                      Total: R$ {selectedSale.total?.toFixed(2) || '0.00'}
                    </Typography>
                  </Box>
                </Grid>

                {selectedSale.observacoes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Observações</Typography>
                    <Typography variant="body1">{selectedSale.observacoes}</Typography>
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de alteração de status */}
        <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Alterar Status da Venda</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Venda: {selectedSale?.numero || 'N/A'} - Cliente: {selectedSale?.cliente}
                </Typography>
                <TextField
                  label="Status"
                  select
                  fullWidth
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="pendente">Pendente</option>
                  <option value="paga">Paga</option>
                  <option value="cancelada">Cancelada</option>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStatusDialogOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleSaveStatus}>
              Salvar
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default Sales;