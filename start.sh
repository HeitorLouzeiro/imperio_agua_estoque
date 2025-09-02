#!/bin/bash

# Script de inicialização do Sistema Império Água Estoque
# Suporta desenvolvimento local e produção com Docker

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Funções de logging
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_header() {
    echo -e "${PURPLE}$1${NC}"
}

# Banner do sistema
show_banner() {
    log_header "=================================================="
    log_header "🌊 SISTEMA IMPÉRIO ÁGUA - CONTROLE DE ESTOQUE 🌊"
    log_header "=================================================="
    echo ""
}

# Verifica dependências
check_dependencies() {
    log_info "Verificando dependências..."
    
    # Verifica Docker e Docker Compose
    if command -v docker &> /dev/null; then
        if command -v docker-compose &> /dev/null; then
            DOCKER_COMPOSE_CMD="docker-compose"
            DOCKER_AVAILABLE=true
            log_success "Docker e Docker Compose v1 encontrados"
        elif docker compose version &> /dev/null; then
            DOCKER_COMPOSE_CMD="docker compose"
            DOCKER_AVAILABLE=true
            log_success "Docker e Docker Compose v2 encontrados"
        else
            DOCKER_AVAILABLE=false
            log_warning "Docker Compose não encontrado - modo desenvolvimento apenas"
        fi
    else
        DOCKER_AVAILABLE=false
        log_warning "Docker não encontrado - modo desenvolvimento apenas"
    fi
    
    # Verifica Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        log_success "Node.js encontrado: $NODE_VERSION"
        NODE_AVAILABLE=true
    else
        NODE_AVAILABLE=false
        log_error "Node.js não encontrado"
    fi
    
    # Verifica MongoDB local (opcional)
    if command -v mongod &> /dev/null; then
        log_success "MongoDB encontrado"
        MONGO_LOCAL=true
    else
        log_warning "MongoDB local não encontrado - utilizará container"
        MONGO_LOCAL=false
    fi
}

# Configuração de ambiente
setup_environment() {
    log_info "Configurando ambiente..."
    
    # Backend environment
    if [ ! -f backend/.env ]; then
        if [ -f backend/.env-example ]; then
            log_info "Criando arquivo .env do backend..."
            cp backend/.env-example backend/.env
            log_success "Arquivo backend/.env criado a partir do exemplo"
        else
            log_warning "Arquivo .env-example não encontrado no backend"
        fi
    fi
    
    # Frontend environment
    if [ ! -f frontend/.env ]; then
        log_info "Criando arquivo .env do frontend..."
        cat > frontend/.env << EOF
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=Império Água
REACT_APP_VERSION=1.0.0
EOF
        log_success "Arquivo frontend/.env criado"
    fi
}

# Instalação de dependências
install_dependencies() {
    if [ "$NODE_AVAILABLE" = true ]; then
        log_info "Instalando dependências do backend..."
        cd backend
        npm install
        cd ..
        log_success "Dependências do backend instaladas"
        
        log_info "Instalando dependências do frontend..."
        cd frontend
        npm install
        cd ..
        log_success "Dependências do frontend instaladas"
    fi
}

# Inicialização com Docker
start_docker() {
    log_info "Iniciando sistema com Docker Compose..."
    
    # Build se necessário
    if [ "$1" = "--build" ]; then
        log_info "Realizando build dos containers..."
        $DOCKER_COMPOSE_CMD build
    fi
    
    # Inicia os serviços
    $DOCKER_COMPOSE_CMD up -d mongo
    log_success "MongoDB iniciado"
    
    sleep 3
    
    $DOCKER_COMPOSE_CMD up -d backend
    log_success "Backend iniciado"
    
    sleep 2
    
    # Frontend (se existir no docker-compose)
    if $DOCKER_COMPOSE_CMD config --services | grep -q "frontend"; then
        $DOCKER_COMPOSE_CMD up -d frontend
        log_success "Frontend iniciado"
    fi
    
    show_services_info
}

# Inicialização em desenvolvimento
start_development() {
    log_info "Iniciando sistema em modo desenvolvimento..."
    
    # Verifica se MongoDB está rodando
    if ! docker ps | grep -q mongo; then
        log_info "Iniciando MongoDB com Docker..."
        $DOCKER_COMPOSE_CMD up -d mongo
        sleep 3
    fi
    
    # Inicia backend em background
    log_info "Iniciando backend..."
    cd backend
    npm start &
    BACKEND_PID=$!
    cd ..
    
    sleep 3
    
    # Inicia frontend
    log_info "Iniciando frontend..."
    cd frontend
    npm start &
    FRONTEND_PID=$!
    cd ..
    
    # Salva PIDs para cleanup
    echo $BACKEND_PID > .backend.pid
    echo $FRONTEND_PID > .frontend.pid
    
    log_success "Sistema iniciado em modo desenvolvimento"
    show_services_info
    
    # Aguarda interrupção
    log_info "Pressione Ctrl+C para parar os serviços..."
    trap cleanup_development SIGINT SIGTERM
    wait
}

# Seed dos dados
seed_data() {
    log_info "Executando seed dos dados..."
    
    if [ "$MODE" = "docker" ]; then
        $DOCKER_COMPOSE_CMD exec backend npm run seed
    else
        cd backend
        npm run seed
        cd ..
    fi
    
    log_success "Dados de exemplo inseridos!"
    echo ""
    log_info "🔑 Credenciais de login:"
    echo "   Admin: admin@imperioagua.com / admin123"
    echo ""
}

# Informações dos serviços
show_services_info() {
    echo ""
    log_header "📋 SERVIÇOS DISPONÍVEIS"
    echo ""
    log_info "🌐 API Backend: http://localhost:5000"
    log_info "📚 Documentação Swagger: http://localhost:5000/api-docs"
    log_info "🖥️  Frontend: http://localhost:8080"
    log_info "🍃 MongoDB: mongodb://localhost:27017/imperio_agua"
    echo ""
}

# Cleanup para desenvolvimento
cleanup_development() {
    log_info "Parando serviços..."
    
    if [ -f .backend.pid ]; then
        BACKEND_PID=$(cat .backend.pid)
        kill $BACKEND_PID 2>/dev/null || true
        rm .backend.pid
    fi
    
    if [ -f .frontend.pid ]; then
        FRONTEND_PID=$(cat .frontend.pid)
        kill $FRONTEND_PID 2>/dev/null || true
        rm .frontend.pid
    fi
    
    log_success "Serviços parados"
    exit 0
}

# Parada dos serviços Docker
stop_docker() {
    log_info "Parando serviços Docker..."
    $DOCKER_COMPOSE_CMD down
    log_success "Serviços Docker parados"
}

# Logs dos serviços
show_logs() {
    if [ "$MODE" = "docker" ]; then
        if [ -n "$1" ]; then
            $DOCKER_COMPOSE_CMD logs -f $1
        else
            $DOCKER_COMPOSE_CMD logs -f
        fi
    else
        log_warning "Logs disponíveis apenas no modo Docker"
    fi
}

# Status dos serviços
show_status() {
    log_header "📊 STATUS DOS SERVIÇOS"
    echo ""
    
    if [ "$MODE" = "docker" ]; then
        $DOCKER_COMPOSE_CMD ps
    else
        log_info "Verificando processos locais..."
        
        # Verifica backend
        if [ -f .backend.pid ] && kill -0 $(cat .backend.pid) 2>/dev/null; then
            log_success "Backend: Rodando (PID: $(cat .backend.pid))"
        else
            log_warning "Backend: Parado"
        fi
        
        # Verifica frontend
        if [ -f .frontend.pid ] && kill -0 $(cat .frontend.pid) 2>/dev/null; then
            log_success "Frontend: Rodando (PID: $(cat .frontend.pid))"
        else
            log_warning "Frontend: Parado"
        fi
        
        # Verifica MongoDB
        if docker ps | grep -q mongo; then
            log_success "MongoDB: Rodando (Docker)"
        else
            log_warning "MongoDB: Parado"
        fi
    fi
}

# Menu de ajuda
show_help() {
    log_header "🚀 SISTEMA IMPÉRIO ÁGUA - GUIA DE USO"
    echo ""
    echo "Uso: ./start.sh [COMANDO] [OPÇÕES]"
    echo ""
    echo "COMANDOS:"
    echo "  start [docker|dev]     Inicia o sistema"
    echo "    docker               Usa Docker Compose (padrão)"
    echo "    dev                  Modo desenvolvimento local"
    echo "    --build              Force rebuild dos containers"
    echo ""
    echo "  stop                   Para todos os serviços"
    echo "  restart               Reinicia todos os serviços"
    echo "  seed                  Popula banco com dados de exemplo"
    echo "  logs [serviço]        Mostra logs (docker apenas)"
    echo "  status                Mostra status dos serviços"
    echo "  setup                 Configura ambiente e instala dependências"
    echo "  help                  Mostra esta ajuda"
    echo ""
    echo "EXEMPLOS:"
    echo "  ./start.sh                    # Inicia com Docker"
    echo "  ./start.sh start dev          # Inicia em desenvolvimento"
    echo "  ./start.sh start docker --build  # Inicia Docker com rebuild"
    echo "  ./start.sh seed               # Popula dados de exemplo"
    echo "  ./start.sh logs backend       # Mostra logs do backend"
    echo ""
}

# Função principal
main() {
    show_banner
    
    case "${1:-start}" in
        "start")
            check_dependencies
            setup_environment
            
            # Se não especificar modo, escolhe automaticamente
            MODE_ARG="${2:-auto}"
            
            case "$MODE_ARG" in
                "docker")
                    if [ "$DOCKER_AVAILABLE" != true ]; then
                        log_error "Docker não disponível. Use: ./start.sh start dev"
                        exit 1
                    fi
                    MODE="docker"
                    start_docker $3
                    ;;
                "dev")
                    if [ "$NODE_AVAILABLE" != true ]; then
                        log_error "Node.js não disponível"
                        exit 1
                    fi
                    MODE="dev"
                    install_dependencies
                    start_development
                    ;;
                "auto")
                    # Escolhe automaticamente baseado na disponibilidade
                    if [ "$DOCKER_AVAILABLE" = true ]; then
                        log_info "Docker disponível - usando modo Docker (use 'dev' para forçar modo desenvolvimento)"
                        MODE="docker"
                        start_docker $3
                    elif [ "$NODE_AVAILABLE" = true ]; then
                        log_info "Docker não disponível - usando modo desenvolvimento"
                        MODE="dev"
                        install_dependencies
                        start_development
                    else
                        log_error "Nem Docker nem Node.js estão disponíveis"
                        exit 1
                    fi
                    ;;
                *)
                    log_error "Modo inválido. Use: docker, dev ou deixe vazio para auto"
                    show_help
                    exit 1
                    ;;
            esac
            ;;
        "stop")
            if $DOCKER_COMPOSE_CMD ps 2>/dev/null | grep -q Up; then
                stop_docker
            else
                cleanup_development
            fi
            ;;
        "restart")
            $0 stop
            sleep 2
            $0 start $2 $3
            ;;
        "seed")
            check_dependencies
            
            # Detecta modo baseado nos serviços rodando
            if [ "$DOCKER_AVAILABLE" = true ] && $DOCKER_COMPOSE_CMD ps 2>/dev/null | grep -q Up; then
                MODE="docker"
            else
                MODE="dev"
            fi
            
            seed_data
            ;;
        "logs")
            MODE="docker"
            show_logs $2
            ;;
        "status")
            check_dependencies
            
            # Detecta modo baseado nos serviços rodando
            if [ "$DOCKER_AVAILABLE" = true ] && $DOCKER_COMPOSE_CMD ps 2>/dev/null | grep -q Up; then
                MODE="docker"
            else
                MODE="dev"
            fi
            
            show_status
            ;;
        "setup")
            check_dependencies
            setup_environment
            if [ "$NODE_AVAILABLE" = true ]; then
                install_dependencies
            fi
            log_success "Ambiente configurado! Execute: ./start.sh start"
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        *)
            log_error "Comando inválido: $1"
            show_help
            exit 1
            ;;
    esac
}

# Executa função principal
main "$@"