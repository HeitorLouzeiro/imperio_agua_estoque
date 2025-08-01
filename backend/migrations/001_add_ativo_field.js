/**
 * Migração para adicionar o campo 'ativo' aos modelos Product e User
 * Esta migração define todos os registros existentes como ativos (ativo: true)
 * 
 * Execute com: node migrations/001_add_ativo_field.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const runMigration = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/imperio_agua_estoque');
    console.log('✅ Conectado ao MongoDB');

    console.log('🔄 Iniciando migração...');

    // Atualizar todos os produtos existentes para ativo: true
    const productsResult = await Product.updateMany(
      { ativo: { $exists: false } }, // Só atualiza se o campo ativo não existir
      { $set: { ativo: true } }
    );
    console.log(`✅ ${productsResult.modifiedCount} produtos atualizados com campo 'ativo: true'`);

    // Atualizar todos os usuários existentes para ativo: true
    const usersResult = await User.updateMany(
      { ativo: { $exists: false } }, // Só atualiza se o campo ativo não existir
      { $set: { ativo: true } }
    );
    console.log(`✅ ${usersResult.modifiedCount} usuários atualizados com campo 'ativo: true'`);

    console.log('🎉 Migração concluída com sucesso!');
    
    // Verificar alguns documentos para confirmar
    const sampleProduct = await Product.findOne();
    const sampleUser = await User.findOne();
    
    console.log('\n📋 Verificação:');
    console.log('Produto exemplo:', sampleProduct ? `${sampleProduct.nome} - ativo: ${sampleProduct.ativo}` : 'Nenhum produto encontrado');
    console.log('Usuário exemplo:', sampleUser ? `${sampleUser.nome} - ativo: ${sampleUser.ativo}` : 'Nenhum usuário encontrado');

  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado do MongoDB');
    process.exit(0);
  }
};

// Executar a migração
runMigration();
