/**
 * Script de demonstração do Soft Delete
 * Este script demonstra como funciona o sistema de soft delete
 * implementado para produtos e usuários
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';

dotenv.config();

const demonstrateSoftDelete = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/imperio_agua_estoque');
    console.log('✅ Conectado ao MongoDB\n');

    console.log('🎭 DEMONSTRAÇÃO DO SOFT DELETE\n');
    
    // 1. Mostrar todos os produtos (incluindo inativos)
    console.log('1️⃣ TODOS OS PRODUTOS NO BANCO:');
    const allProducts = await Product.find({}).select('codigo nome ativo');
    allProducts.forEach(p => {
      console.log(`   ${p.codigo} - ${p.nome} - ${p.ativo ? '✅ ATIVO' : '❌ INATIVO'}`);
    });
    
    // 2. Mostrar apenas produtos ativos (consulta padrão)
    console.log('\n2️⃣ PRODUTOS ATIVOS (consulta padrão):');
    const activeProducts = await Product.find({ ativo: true }).select('codigo nome');
    activeProducts.forEach(p => {
      console.log(`   ${p.codigo} - ${p.nome}`);
    });

    // 3. Mostrar apenas produtos inativos
    console.log('\n3️⃣ PRODUTOS INATIVOS:');
    const inactiveProducts = await Product.find({ ativo: false }).select('codigo nome');
    if (inactiveProducts.length > 0) {
      inactiveProducts.forEach(p => {
        console.log(`   ${p.codigo} - ${p.nome}`);
      });
    } else {
      console.log('   Nenhum produto inativo encontrado');
    }

    // 4. Demonstrar soft delete de um produto
    const productToDeactivate = await Product.findOne({ ativo: true });
    if (productToDeactivate) {
      console.log(`\n4️⃣ DEMONSTRANDO SOFT DELETE DO PRODUTO: ${productToDeactivate.nome}`);
      
      // Simular soft delete
      await Product.findByIdAndUpdate(productToDeactivate._id, { ativo: false });
      console.log(`   ✅ Produto "${productToDeactivate.nome}" foi DESATIVADO`);
      
      // Verificar se não aparece mais na consulta padrão
      const activeAfterDelete = await Product.find({ ativo: true }).select('codigo nome');
      console.log(`   📊 Produtos ativos restantes: ${activeAfterDelete.length}`);
      
      // Reativar o produto
      await Product.findByIdAndUpdate(productToDeactivate._id, { ativo: true });
      console.log(`   🔄 Produto "${productToDeactivate.nome}" foi REATIVADO`);
    }

    // 5. Mostrar usuários
    console.log('\n5️⃣ USUÁRIOS NO SISTEMA:');
    const allUsers = await User.find({}).select('nome email ativo').lean();
    allUsers.forEach(u => {
      console.log(`   ${u.nome} (${u.email}) - ${u.ativo ? '✅ ATIVO' : '❌ INATIVO'}`);
    });

    // 6. Demonstrar que usuários inativos não fazem login
    console.log('\n6️⃣ SIMULAÇÃO DE LOGIN:');
    const activeUser = await User.findOne({ ativo: true }).select('nome email');
    const inactiveUser = await User.findOne({ ativo: false }).select('nome email');
    
    if (activeUser) {
      console.log(`   ✅ ${activeUser.nome} PODE fazer login (usuário ativo)`);
    }
    
    if (inactiveUser) {
      console.log(`   ❌ ${inactiveUser.nome} NÃO PODE fazer login (usuário inativo)`);
    }

    console.log('\n📝 RESUMO DOS BENEFÍCIOS:');
    console.log('   • Histórico de vendas preservado');
    console.log('   • Produtos/usuários podem ser reativados');
    console.log('   • Consultas padrão retornam apenas itens ativos');
    console.log('   • Segurança: usuários inativos não fazem login');
    console.log('   • Integridade referencial mantida');

  } catch (error) {
    console.error('❌ Erro durante a demonstração:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado do MongoDB');
    process.exit(0);
  }
};

// Executar a demonstração
demonstrateSoftDelete();
