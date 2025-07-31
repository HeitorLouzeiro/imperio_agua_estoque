# 🖨️ Funcionalidades de Impressão e Compartilhamento

## ✅ Implementado

As funcionalidades de **impressão** e **compartilhamento** foram completamente implementadas e integradas aos componentes da página de vendas.

### 📄 Impressão de Recibos

- **Localização**: Botão de impressão no `SaleViewDialog`
- **Funcionalidade**: Abre uma nova janela com layout profissional para impressão
- **Características**:
  - Header com logo e informações da empresa
  - Dados da venda organizados em seções
  - Tabela de produtos com formatação profissional
  - Cálculos de totais destacados
  - CSS otimizado para impressão (@media print)
  - Status da venda com cores diferenciadas

### 📱 Compartilhamento de Recibos

- **Localização**: Botão de compartilhamento no `SaleViewDialog`
- **Funcionalidades**:
  - **Compartilhamento Nativo**: Usa `navigator.share()` quando disponível (dispositivos móveis)
  - **Fallback para Desktop**: Copia automaticamente para área de transferência
  - **Formato Text**: Recibo formatado com emojis e layout organizado
  - **Mensagens de Feedback**: Notificações de sucesso/erro via snackbar

## 🏗️ Estrutura dos Arquivos

```
src/
├── utils/
│   ├── index.ts
│   └── receiptUtils.ts    # Funções de impressão e compartilhamento
├── components/sales/
│   └── SaleViewDialog.tsx # Integração das funcionalidades
└── pages/
    └── Sales.tsx          # Callbacks de sucesso/erro
```

## 🎯 Como Funciona

### 1. **Impressão**
```typescript
// Ao clicar no botão de impressão
handlePrint = () => {
  printReceipt(sale);
  onSuccess?.('Recibo enviado para impressão!');
};
```

### 2. **Compartilhamento**
```typescript
// Ao clicar no botão de compartilhamento
handleShare = async () => {
  await shareReceipt(sale, onSuccess, onError);
};
```

### 3. **Detecção Automática**
- **Mobile**: Usa API nativa de compartilhamento
- **Desktop**: Copia para área de transferência automaticamente

## 📋 Formato do Recibo

### Impressão (HTML)
- Layout profissional com CSS
- Logo e branding da empresa
- Tabelas formatadas
- Cores e estilos responsivos
- Otimizado para papel A4

### Compartilhamento (Texto)
```
🧾 RECIBO - IMPÉRIO ÁGUA
━━━━━━━━━━━━━━━━━━━━━━━━

📄 Número: #001
📅 Data: 31/07/2025
👤 Cliente: João Silva
💳 Pagamento: PIX
📊 Status: PAGA

📦 ITENS:
Água 20L (A001) - Qtd: 2 - R$ 8.00 = R$ 16.00

━━━━━━━━━━━━━━━━━━━━━━━━
💰 Subtotal: R$ 16.00
🏷️ Desconto: R$ 0.00
💵 TOTAL: R$ 16.00

Obrigado pela preferência! 🙏
```

## 🧪 Como Testar

### Impressão
1. Abra a página de vendas
2. Clique em "Visualizar" em uma venda
3. No modal, clique no ícone de impressão 🖨️
4. Verá o recibo formatado em nova janela
5. Use Ctrl+P para imprimir

### Compartilhamento
1. Abra a página de vendas
2. Clique em "Visualizar" em uma venda  
3. No modal, clique no ícone de compartilhamento 📱
4. **Mobile**: Abrirá menu nativo de compartilhamento
5. **Desktop**: Copiará automaticamente para área de transferência

## 🎨 Personalização

As funções em `receiptUtils.ts` podem ser facilmente personalizadas:

- **Cores e estilos**: Modifique o CSS no `generateReceiptHTML()`
- **Layout texto**: Ajuste emojis e formatação no `generateReceiptText()`
- **Logo/Branding**: Altere header no HTML
- **Campos adicionais**: Adicione novos dados da venda

## 📊 Benefícios

- ✅ **Experiência Profissional**: Recibos com layout empresarial
- ✅ **Multi-plataforma**: Funciona em mobile e desktop
- ✅ **Feedback Visual**: Notificações claras para o usuário
- ✅ **Fallback Inteligente**: Sempre funciona, independente do dispositivo
- ✅ **Performance**: Funções otimizadas e componentizadas
- ✅ **Manutenibilidade**: Código separado e reutilizável

As funcionalidades estão **100% funcionais** e prontas para uso em produção! 🚀
