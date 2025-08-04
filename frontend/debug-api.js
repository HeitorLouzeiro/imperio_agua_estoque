// Teste simples da API sem React
const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

async function testarAPI() {
  try {
    console.log('Testando login...');
    const loginResponse = await api.post('/usuarios/login', {
      email: 'admin@imperioagua.com',
      senha: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('Login bem-sucedido, token:', token.substring(0, 20) + '...');
    
    // Configurar token
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    console.log('\nTestando estatísticas...');
    const statsResponse = await api.get('/vendas/estatisticas');
    console.log('Estatísticas:', {
      totalVendas: statsResponse.data.totalVendas,
      receitaTotal: statsResponse.data.receitaTotal,
      receitaHoje: statsResponse.data.receitaHoje
    });
    
    console.log('\nTestando produtos...');
    const productsResponse = await api.get('/produtos');
    console.log('Total de produtos:', productsResponse.data.length);
    
    console.log('\nTestando usuários...');
    const usersResponse = await api.get('/usuarios/listuser');
    console.log('Total de usuários:', usersResponse.data.length);
    
    console.log('\nTestando vendas...');
    const salesResponse = await api.get('/vendas');
    console.log('Total de vendas:', salesResponse.data.length);
    
    console.log('\n✅ Todos os testes passaram!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testarAPI();
