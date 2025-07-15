# Frontend - Sistema de Controle de Estoque Império Água

Interface moderna desenvolvida com React e Material-UI para o sistema de gestão de estoque de água.

## 🚀 Tecnologias Utilizadas

- **React 18** - Biblioteca para interface de usuário
- **Material-UI (MUI)** - Componentes de interface moderna
- **React Router** - Navegação entre páginas
- **Axios** - Cliente HTTP para API
- **Context API** - Gerenciamento de estado global

## 📦 Funcionalidades

### ✅ Implementadas
- **Autenticação**
  - Login com validação
  - Registro de novos usuários
  - Proteção de rotas
  - Gerenciamento de sessão

- **Dashboard**
  - Interface responsiva
  - Menu lateral com navegação
  - Header com informações do usuário

- **Gestão de Produtos**
  - Listagem com DataGrid
  - Criar, editar e excluir produtos
  - Indicadores visuais de estoque
  - Filtros e busca

- **Gestão de Usuários** (Admin apenas)
  - CRUD completo de usuários
  - Controle de papéis (Admin/Operador)
  - Interface intuitiva

### 🔄 Para Implementar
- Conexão com API backend
- Relatórios e dashboards
- Notificações em tempo real
- Temas personalizáveis

## 🎨 Design System

### Paleta de Cores
- **Primary**: #1976d2 (Azul)
- **Secondary**: #dc004e (Vermelho)
- **Background**: #f5f5f5 (Cinza claro)

### Componentes Principais
- **DataGrid**: Tabelas interativas com MUI X
- **Forms**: Formulários responsivos com validação
- **Dialogs**: Modais para CRUD operations
- **Snackbars**: Feedbacks de ações

## 🔐 Autenticação

### Credenciais de Teste
```
Email: admin@imperio.com
Senha: 123456
```

### Fluxo de Autenticação
1. Login salva token JWT no localStorage
2. Context API gerencia estado global do usuário
3. Rotas protegidas verificam autenticação
4. Interceptors do Axios incluem token automaticamente

## 📱 Responsividade

- **Mobile First**: Design otimizado para dispositivos móveis
- **Breakpoints**: Adaptação automática para tablet e desktop
- **Menu Lateral**: Collapsible em telas pequenas

## 🛠️ Como Executar

```bash
# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npm start

# Build para produção
npm run build
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
