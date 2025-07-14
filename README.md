# Imperio Água Estoque

Sistema de controle de estoque de água com backend em Node.js, MongoDB e frontend em Next.js.

## Como rodar com Docker Compose

1. Certifique-se de ter o Docker e Docker Compose instalados.
2. Execute os comandos:
   ```bash
   docker compose build
   docker compose up
   ```
3. O backend estará disponível em `http://localhost:3000/`.
4. A documentação da API estará em `http://localhost:3000/api-docs`.

## Estrutura do projeto
- `backend/`: API Node.js + Express + MongoDB
- `frontend/`: Interface Next.js (não conectada à API por padrão)
- `docker-compose.yml`: Orquestração dos serviços

## Variáveis de ambiente
O backend utiliza o arquivo `.env` para configuração:
```
MONGO_URI=mongodb://mongo:27017/imperio_agua
JWT_SECRET=sua_chave_secreta_jwt_super_segura_aqui_123456789
PORT=3000
NODE_ENV=development
```

## Funcionalidades principais
- Cadastro e autenticação de usuários (funcionário e administrador)
- CRUD de produtos (código, marca, preço, quantidade)
- Proteção de rotas via JWT
- Documentação Swagger

## Observações
- O MongoDB roda em container separado.
- O frontend pode ser integrado à API conforme necessidade.

---
GitHub Copilot