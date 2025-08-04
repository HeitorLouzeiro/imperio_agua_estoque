import { Sale } from '../types';

// Gerar texto do recibo para compartilhamento
export const generateReceiptText = (sale: Sale): string => {
  const itensText = sale.itens?.map(item => {
    const nomeProduto = (typeof item.produto === 'object' && 'nome' in item.produto ? item.produto.nome : null) ||
                       item.product?.nome || item.product?.name || item.nome || 'Produto';
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

// Gerar HTML do recibo para impressão
export const generateReceiptHTML = (sale: Sale): string => {
  const itensHTML = sale.itens?.map(item => {
    const nomeProduto = (typeof item.produto === 'object' && 'nome' in item.produto ? item.produto.nome : null) ||
                       item.product?.nome || item.product?.name || item.nome || 'Produto';
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

// Imprimir recibo
export const printReceipt = (sale: Sale): void => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    const receiptHTML = generateReceiptHTML(sale);
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    printWindow.print();
  }
};

// Compartilhar recibo
export const shareReceipt = async (sale: Sale, onSuccess?: (message: string) => void, onError?: (message: string) => void): Promise<void> => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Recibo - ${sale.numero}`,
        text: `Recibo da venda para ${sale.cliente} - Total: R$ ${sale.total?.toFixed(2)}`,
        url: window.location.href
      });
      onSuccess?.('Recibo compartilhado com sucesso!');
    } catch (error) {
      console.log('Erro ao compartilhar:', error);
      copyReceiptToClipboard(sale, onSuccess, onError);
    }
  } else {
    copyReceiptToClipboard(sale, onSuccess, onError);
  }
};

// Copiar recibo para área de transferência
export const copyReceiptToClipboard = (sale: Sale, onSuccess?: (message: string) => void, onError?: (message: string) => void): void => {
  const receiptText = generateReceiptText(sale);
  navigator.clipboard.writeText(receiptText).then(() => {
    onSuccess?.('Recibo copiado para a área de transferência!');
  }).catch(() => {
    onError?.('Erro ao copiar recibo');
  });
};
