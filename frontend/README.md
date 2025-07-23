# Frontend - Império Água

Interface web moderna para o sistema de gestão de estoque do Império Água, desenvolvida em ReactJS com Material-UI.

## 🚀 Tecnologias

- **React 18** - Biblioteca JavaScript para interfaces
- **Material-UI (MUI)** - Framework de componentes React
- **React Router** - Navegação entre páginas
- **Axios** - Cliente HTTP para API
- **Recharts** - Biblioteca para gráficos
- **Date-fns** - Manipulação de datas

## 📋 Pré-requisitos

- Node.js 16 ou superior
- npm ou yarn
- Backend do Império Água rodando

## 🛠️ Instalação

### Automática
```bash
./setup.sh
```

### Manual
```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env

# Configurar URL da API no arquivo .env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🎯 Uso

### Desenvolvimento
```bash
npm start
```
Acesse: http://localhost:3000

### Build de Produção
```bash
npm run build
```

### Testes
```bash
npm test
```

## 📱 Páginas

### 🔐 Login
- Autenticação de usuários
- Validação de formulário
- Feedback visual de erros

### 📊 Dashboard
- Visão geral do sistema
- Gráficos de vendas
- Estatísticas em tempo real
- Produtos com estoque baixo

### 📦 Produtos
- Listagem com filtros e busca
- Cadastro e edição
- Controle de estoque
- Categorização

### 💰 Vendas
- Registro de vendas
- Histórico de transações
- Relatórios de performance
- Análise por período

### 👥 Usuários
- Gestão de usuários
- Controle de permissões
- Perfis e funções
- Status de atividade

## 🎨 Funcionalidades

### Design Responsivo
- Layout adaptável para mobile, tablet e desktop
- Componentes otimizados para touch
- Navegação intuitiva

### Tema Customizado
- Cores da marca Império Água
- Tipografia consistente
- Componentes padronizados

### Estado Global
- Context API para autenticação
- Gerenciamento de estado reativo
- Proteção de rotas

### Integração com API
- Chamadas HTTP organizadas em services
- Tratamento de erros centralizado
- Loading states e feedback

## 📁 Estrutura de Pastas

```
src/
├── components/          # Componentes reutilizáveis
│   └── common/         # Componentes comuns
├── contexts/           # Contextos React
├── pages/              # Páginas da aplicação
├── services/           # Serviços de API
├── utils/              # Utilitários
├── theme.js            # Tema Material-UI
├── App.js              # Componente principal
└── index.js            # Ponto de entrada
```

## 🔧 Configuração

### Variáveis de Ambiente
Configurar no arquivo `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=Império Água
REACT_APP_VERSION=1.0.0
```

### Customização do Tema
Editar `src/theme.js` para personalizar:
- Cores primárias e secundárias
- Tipografia
- Espaçamentos
- Breakpoints

## 🔗 Integração com Backend

O frontend se comunica com o backend através de:

### Endpoints Utilizados
- `POST /api/usuarios/login` - Autenticação
- `GET /api/produtos` - Listagem de produtos
- `POST /api/vendas` - Registro de vendas
- `GET /api/usuarios` - Gestão de usuários

### Autenticação
- JWT tokens para autenticação
- Armazenamento seguro no localStorage
- Renovação automática de tokens

## 📱 Responsividade

### Breakpoints
- **xs**: 0px - 599px (Mobile)
- **sm**: 600px - 899px (Tablet)
- **md**: 900px - 1199px (Desktop pequeno)
- **lg**: 1200px - 1535px (Desktop)
- **xl**: 1536px+ (Desktop grande)

### Layout Adaptativo
- Sidebar colapsável em mobile
- Tabelas responsivas com scroll horizontal
- Cards que se reorganizam em diferentes telas

## 🎭 Estados da Aplicação

### Loading States
- Skeleton loaders para tabelas
- Spinners para ações
- Progress bars para uploads

### Error Handling
- Snackbars para feedback
- Páginas de erro customizadas
- Retry mechanisms

## 🚀 Deploy

### Build
```bash
npm run build
```

### Servir Arquivos Estáticos
```bash
npx serve -s build
```

### Docker (Opcional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npx", "serve", "-s", "build"]
```

## 🤝 Contribuição

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 💬 Suporte

Para dúvidas ou suporte, entre em contato:
- Email: suporte@imperioagua.com
- Issues: [GitHub Issues](link-para-issues)

---

Desenvolvido com ❤️ para o Império Água
