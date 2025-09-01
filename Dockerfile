# Dockerfile raiz para deploy do backend no Render
# Usa Node 22 (compatível com o Dockerfile existente em backend/)
FROM node:22-alpine

# Diretório de trabalho
WORKDIR /app

# Copia apenas os manifests primeiro para otimizar cache
COPY backend/package*.json ./backend/

# Instala dependências do backend
WORKDIR /app/backend
RUN npm install --omit=dev || npm install

# Copia o código do backend
COPY backend/ ./

# Ambiente de produção
ENV NODE_ENV=production
ENV HOST=0.0.0.0

# Porta informativa (Render injeta $PORT e o app já lê process.env.PORT)
EXPOSE 5000

# Comando de inicialização
CMD ["npm", "start"]
