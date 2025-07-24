#!/bin/bash

# Script para inicializar o frontend do Império Água

echo "🚀 Iniciando configuração do frontend..."

# Verifica se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js primeiro."
    exit 1
fi

# Verifica se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Por favor, instale o npm primeiro."
    exit 1
fi

echo "✅ Node.js e npm encontrados"

# Navega para o diretório do frontend
cd "$(dirname "$0")"

echo "📦 Instalando dependências..."

# Instala as dependências
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependências instaladas com sucesso!"
    echo ""
    echo "🎉 Frontend configurado com sucesso!"
    echo ""
    echo "Para iniciar o desenvolvimento:"
    echo "  cd frontend"
    echo "  npm start"
    echo ""
    echo "Para fazer build de produção:"
    echo "  npm run build"
    echo ""
    echo "📋 Comandos disponíveis:"
    echo "  npm start     - Inicia o servidor de desenvolvimento"
    echo "  npm run build - Cria build de produção"
    echo "  npm test      - Executa os testes"
    echo "  npm run eject - Ejeta configurações do Create React App"
else
    echo "❌ Erro ao instalar dependências"
    exit 1
fi
