# Implementação de Soft Delete - Império Água Estoque

## 📋 Resumo das Alterações

Este documento descreve as mudanças implementadas para substituir a exclusão física (hard delete) por exclusão lógica (soft delete) nos modelos de **Produtos** e **Usuários** do sistema.

## 🎯 Objetivos

- ✅ Preservar integridade dos dados históricos de vendas
- ✅ Manter referências de produtos e usuários em vendas antigas
- ✅ Implementar desativação ao invés de exclusão definitiva
- ✅ Atualizar interface do usuário para refletir as mudanças

## 🔧 Alterações no Backend

### 1. Modelos (Models)

#### Product.js
```javascript
// Adicionado campo 'ativo' com valor padrão true
ativo: { type: Boolean, default: true }
```

#### User.js
```javascript
// Adicionado campo 'ativo' com valor padrão true
ativo: { type: Boolean, default: true }
```

### 2. Controllers

#### productController.js
- **listarProdutos()**: Agora filtra apenas produtos ativos (`{ ativo: true }`)
- **deletarProduto()**: Mudou de `findByIdAndDelete()` para `findByIdAndUpdate()` com `{ ativo: false }`
- **buscarProdutoPorCodigo()**: Inclui filtro `ativo: true`
- **getById()**: Inclui filtro `ativo: true`
- **buscarProdutoPorMarca()**: Inclui filtro `ativo: true`
- **Novas funções**:
  - `reativarProduto()`: Reativa um produto desativado
  - `listarProdutosInativos()`: Lista produtos inativos

#### userController.js
- **login()**: Só permite login de usuários ativos (`{ ativo: true }`)
- **listarUsuarios()**: Filtra apenas usuários ativos
- **obterPerfil()**: Inclui filtro `ativo: true`
- **excluirUsuario()**: Mudou para soft delete (`{ ativo: false }`)
- **Novas funções**:
  - `reativarUsuario()`: Reativa um usuário desativado
  - `listarUsuariosInativos()`: Lista usuários inativos

#### saleController.js
- **criarVenda()**: Valida se produtos estão ativos antes de criar venda
- **listarVendas()**: Populates sem filtro `match` para preservar histórico
- **obterVenda()**: Populates sem filtro `match` para preservar histórico
- **⚠️ IMPORTANTE**: Produtos/usuários inativos são carregados nas vendas para preservar histórico

### 3. Rotas (Routes)

#### productRoutes.js
```javascript
// Novas rotas adicionadas
router.get('/inativos/listar', autenticar, listarProdutosInativos);
router.patch('/:id/reativar', autenticar, reativarProduto);
```

#### userRoutes.js
```javascript
// Novas rotas adicionadas
router.get('/inativos/listar', autenticar, listarUsuariosInativos);
router.patch('/:id/reativar', autenticar, reativarUsuario);
```

### 4. Migração

#### migrations/001_add_ativo_field.js
- Script para adicionar campo `ativo: true` em todos os registros existentes
- Execução: `npm run migrate`

## 🎨 Alterações no Frontend

### 1. Tipos (Types)

#### index.ts
```typescript
// Adicionado campo opcional 'ativo' aos interfaces
ativo?: boolean;
```

### 2. Serviços (Services)

#### index.ts
```typescript
// Novas funções para usuários
reactivateUser: async (id: number) => Promise<ApiResponse<User>>
getInactiveUsers: async () => Promise<User[]>

// Novas funções para produtos
reactivate: async (id: string | number) => Promise<ApiResponse<Product>>
getInactive: async () => Promise<Product[]>
```

### 3. Hooks

#### useProductManagement.ts
- **handleDelete()**: Atualizado para mostrar mensagem sobre desativação
- Confirmação alterada para explicar que é soft delete

#### useUserManagement.ts
- **handleDelete()**: Atualizado para mostrar mensagem sobre desativação
- Confirmação alterada para explicar que é soft delete

### 4. Componentes

#### ProductTable.tsx
- Ícone alterado de `DeleteIcon` para `BlockIcon`
- Tooltip alterado de "Excluir" para "Desativar"

#### UserTable.tsx
- Ícone alterado de `Delete` para `Block`
- Tooltip alterado de "Excluir Usuário" para "Desativar Usuário"

#### SaleViewDialog.tsx
- **Produtos inativos são marcados** com chip "Produto Inativo"
- **Mensagem explicativa** quando produto foi desativado após a venda
- **Preserva histórico** mostrando todos os produtos da venda original

## 🚀 Como Executar a Migração

1. **Parar o servidor** (se estiver rodando)

2. **Executar a migração**:
   ```bash
   cd backend
   npm run migrate
   ```

3. **Popular banco com dados de teste** (opcional):
   ```bash
   npm run seed
   ```

4. **Demonstração do soft delete** (opcional):
   ```bash
   npm run demo-soft-delete
   ```

5. **Reiniciar o servidor**:
   ```bash
   npm run dev
   ```

### Scripts Disponíveis

- `npm run migrate` - Executa migração para adicionar campo `ativo`
- `npm run seed` - Popula banco com dados de teste (incluindo itens inativos)
- `npm run demo-soft-delete` - Demonstra funcionamento do soft delete

## 🔍 Verificações de Integridade

### Vendas Existentes
- ✅ Vendas antigas continuam funcionando
- ✅ Produtos/usuários inativos ainda aparecem no histórico
- ✅ Produtos inativos são **marcados visualmente** nas vendas
- ✅ Novos produtos só listam ativos
- ✅ Novos usuários só incluem ativos

### Interface do Usuário
- ✅ Botão "Excluir" agora mostra "Desativar"
- ✅ Mensagens de confirmação explicam soft delete
- ✅ Ícones atualizados (Block ao invés de Delete)

## 📊 Funcionalidades Futuras

### Possíveis Melhorias
1. **Painel de Recuperação**: Interface para reativar produtos/usuários
2. **Filtros Avançados**: Opção de visualizar ativos/inativos/todos
3. **Auditoria**: Log de quando itens foram desativados e por quem
4. **Auto-limpeza**: Script para remover definitivamente itens muito antigos

### Rotas Disponíveis para Implementação
```
GET /api/produtos/inativos/listar - Lista produtos inativos
PATCH /api/produtos/:id/reativar - Reativa produto

GET /api/usuarios/inativos/listar - Lista usuários inativos  
PATCH /api/usuarios/:id/reativar - Reativa usuário
```

## ⚠️ Observações Importantes

1. **Compatibilidade**: O sistema mantém retrocompatibilidade
2. **Performance**: Queries agora incluem filtro `ativo: true` por padrão
3. **Segurança**: Usuários inativos não conseguem fazer login
4. **Vendas**: Produtos inativos não aparecem para novas vendas

## 🧪 Testes Recomendados

### Dados de Teste Incluídos
Após executar `npm run seed`, você terá:

**Usuários Ativos:**
- admin@imperioagua.com / admin123 (Administrador)
- funcionario@imperioagua.com / func123 (Funcionário)

**Usuário Inativo:**
- exfuncionario@imperioagua.com / senha123 (Ex-Funcionário - não consegue login)

**Produtos Ativos:**
- AGUA20L - Água Mineral 20L (Imperial)
- AGUA10L - Água Mineral 10L (Cristal) 
- AGUA5L - Água Mineral 5L (Fonte Pura)

**Produtos Inativos:**
- AGUA1L - Água Mineral 1L (Antiga)
- REFRI2L - Refrigerante 2L (Descontinuada)

**Vendas de Exemplo:**
- V000001 - Apenas produtos ativos
- V000002 - Apenas produtos ativos  
- V000003 - **Contém produto inativo** (demonstra preservação do histórico)

### Cenários para Testar
1. **Testar criação de novas vendas** apenas com produtos ativos
2. **Verificar login** apenas com usuários ativos
3. **Confirmar histórico** de vendas antigas mantido
4. **Testar reativação** de produtos/usuários
5. **Validar interface** com novos ícones e mensagens
