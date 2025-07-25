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
    },
    {
      nome: 'Funcionário',
      email: 'funcionario@imperioagua.com',
      senha: await bcrypt.hash('func123', 10),
      papel: 'funcionario',
    },
  ];
  await User.deleteMany({});
  const createdUsers = await User.insertMany(users);

  // Produtos
  const products = [
    { codigo: 'AGUA20L', marca: 'Imperial', preco: 10.0, quantidade: 100 },
    { codigo: 'AGUA10L', marca: 'Cristal', preco: 7.0, quantidade: 50 },
    { codigo: 'AGUA5L', marca: 'Fonte Pura', preco: 4.0, quantidade: 80 },
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
      desconto: 0,
      subtotal: 2 * createdProducts[0].preco + 1 * createdProducts[1].preco,
      total: 2 * createdProducts[0].preco + 1 * createdProducts[1].preco,
      formaPagamento: 'dinheiro',
      status: 'paga',
      observacoes: 'Cliente pagou em dinheiro.'
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
    }
  ];

  await Sale.deleteMany({});
  await Sale.insertMany(vendas);

  console.log('Usuários, produtos e vendas de teste inseridos com sucesso!');
  await mongoose.disconnect();
}

seed().catch(console.error);
