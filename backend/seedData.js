import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';
import Sale from './models/Sale.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/imperio_agua';

async function seed() {
  await mongoose.connect(MONGO_URI);

  // Usuários
  const users = [
    {
      nome: 'Administrador',
      email: 'admin@imperioagua.com',
      senha: await bcrypt.hash('admin123', 10),
      papel: 'administrador',
      ativo: true,
    },
    {
      nome: 'Funcionário',
      email: 'funcionario@imperioagua.com',
      senha: await bcrypt.hash('func123', 10),
      papel: 'funcionario',
      ativo: true,
    },
    // Usuários inativos para teste
    {
      nome: 'Ex-Funcionário',
      email: 'exfuncionario@imperioagua.com',
      senha: await bcrypt.hash('senha123', 10),
      papel: 'funcionario',
      ativo: false,
    },
  ];
  await User.deleteMany({});
  const createdUsers = await User.insertMany(users);

  // Produtos
  const products = [
    { codigo: 'AGUA20L', nome: 'Água Mineral 20L', marca: 'Imperial', preco: 10.0, quantidade: 100, ativo: true },
    { codigo: 'AGUA10L', nome: 'Água Mineral 10L', marca: 'Cristal', preco: 7.0, quantidade: 50, ativo: true },
    { codigo: 'AGUA5L', nome: 'Água Mineral 5L', marca: 'Fonte Pura', preco: 4.0, quantidade: 80, ativo: true },
    // Produtos inativos para teste
    { codigo: 'AGUA1L', nome: 'Água Mineral 1L', marca: 'Antiga', preco: 2.0, quantidade: 0, ativo: false },
    { codigo: 'REFRI2L', nome: 'Refrigerante 2L', marca: 'Descontinuada', preco: 5.0, quantidade: 0, ativo: false },
  ];
  await Product.deleteMany({});
  const createdProducts = await Product.insertMany(products);

  // Vendas com cálculo manual de subtotal, total e número
  const vendas = [
    {
      numero: 'V000001',
      cliente: 'João da Silva',
      vendedor: createdUsers[1]._id,
      itens: [
        {
          produto: createdProducts[0]._id,
          quantidade: 2,
          precoUnitario: createdProducts[0].preco,
          subtotal: 2 * createdProducts[0].preco,
        },
        {
          produto: createdProducts[1]._id,
          quantidade: 1,
          precoUnitario: createdProducts[1].preco,
          subtotal: 1 * createdProducts[1].preco,
        },
      ],
      desconto: 5,
      subtotal: 3 * createdProducts[0].preco,
      total: (3 * createdProducts[0].preco) - 5,
      formaPagamento: 'cartao_credito',
      status: 'paga',
      observacoes: 'Primeira venda do dia.'
    },
    {
      numero: 'V000002',
      cliente: 'Maria Oliveira',
      vendedor: createdUsers[1]._id,
      itens: [
        {
          produto: createdProducts[2]._id,
          quantidade: 3,
          precoUnitario: createdProducts[2].preco,
          subtotal: 3 * createdProducts[2].preco,
        }
      ],
      desconto: 2,
      subtotal: 3 * createdProducts[2].preco,
      total: 3 * createdProducts[2].preco - 2,
      formaPagamento: 'pix',
      status: 'paga',
      observacoes: 'Desconto promocional.'
    },
    {
      numero: 'V000003',
      cliente: 'Carlos Silva',
      vendedor: createdUsers[1]._id,
      itens: [
        {
          produto: createdProducts[3]._id, // Produto que agora está inativo (AGUA1L)
          quantidade: 5,
          precoUnitario: createdProducts[3].preco,
          subtotal: 5 * createdProducts[3].preco,
        },
        {
          produto: createdProducts[0]._id, // Produto ativo
          quantidade: 1,
          precoUnitario: createdProducts[0].preco,
          subtotal: 1 * createdProducts[0].preco,
        }
      ],
      desconto: 0,
      subtotal: 5 * createdProducts[3].preco + 1 * createdProducts[0].preco,
      total: 5 * createdProducts[3].preco + 1 * createdProducts[0].preco,
      formaPagamento: 'cartao_debito',
      status: 'paga',
      observacoes: 'Venda histórica com produto descontinuado.'
    },
    {
      numero: 'V000004',
      cliente: 'Ana Costa',
      vendedor: createdUsers[1]._id,
      itens: [
        {
          produto: createdProducts[1]._id,
          quantidade: 2,
          precoUnitario: createdProducts[1].preco,
          subtotal: 2 * createdProducts[1].preco,
        }
      ],
      desconto: 0,
      subtotal: 2 * createdProducts[1].preco,
      total: 2 * createdProducts[1].preco,
      formaPagamento: 'pix',
      status: 'pendente',
      observacoes: 'Aguardando confirmação do pagamento PIX.'
    },
    {
      numero: 'V000005',
      cliente: 'Pedro Santos',
      vendedor: createdUsers[1]._id,
      itens: [
        {
          produto: createdProducts[0]._id,
          quantidade: 1,
          precoUnitario: createdProducts[0].preco,
          subtotal: 1 * createdProducts[0].preco,
        }
      ],
      desconto: 0,
      subtotal: 1 * createdProducts[0].preco,
      total: 1 * createdProducts[0].preco,
      formaPagamento: 'dinheiro',
      status: 'cancelada',
      observacoes: 'Cliente desistiu da compra.'
    }
  ];

  await Sale.deleteMany({});
  await Sale.insertMany(vendas);

  console.log('✅ Dados de teste inseridos com sucesso!');
  console.log('📊 Resumo:');
  console.log(`   - ${users.length} usuários (${users.filter(u => u.ativo).length} ativos, ${users.filter(u => !u.ativo).length} inativos)`);
  console.log(`   - ${products.length} produtos (${products.filter(p => p.ativo).length} ativos, ${products.filter(p => !p.ativo).length} inativos)`);
  console.log(`   - ${vendas.length} vendas de exemplo`);
  console.log('');
  console.log('🔑 Credenciais de login:');
  console.log('   Admin: admin@imperioagua.com / admin123');
  console.log('   Funcionário: funcionario@imperioagua.com / func123');
  console.log('   Ex-Funcionário (inativo): exfuncionario@imperioagua.com / senha123');
  console.log('');
  console.log('📋 Teste de Soft Delete:');
  console.log('   - Venda V000003 contém produtos ativos e inativos');
  console.log('   - Produtos inativos aparecem marcados nas vendas históricas');
  console.log('   - Novos produtos/usuários listam apenas os ativos');
  
  await mongoose.disconnect();
}

seed().catch(console.error);
