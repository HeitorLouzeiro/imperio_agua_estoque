import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Helper function para validar e converter ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const toObjectId = (id) => {
  if (typeof id === 'string' && mongoose.Types.ObjectId.isValid(id)) {
    return new mongoose.Types.ObjectId(id);
  }
  return id;
};

export const registrar = async (req, res) => {
  try {
    const { nome, email, senha, papel } = req.body;
    const hash = await bcrypt.hash(senha, 10);
    const usuario = new User({ nome, email, senha: hash, papel });
    await usuario.save();
    res.status(201).json(usuario);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await User.findOne({ email, ativo: true });
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
    const valido = await bcrypt.compare(senha, usuario.senha);
    if (!valido) return res.status(401).json({ erro: 'Senha incorreta' });
    const token = jwt.sign({ id: usuario._id, papel: usuario.papel }, process.env.JWT_SECRET || 'segredo', { expiresIn: '1d' });
    res.json({ token });  
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find({ ativo: true }).select('-senha');
    res.json(usuarios);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

export const obterPerfil = async (req, res) => {
  try {
    const usuario = await User.findOne({ _id: req.userId, ativo: true }).select('-senha');
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.json({
      id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      papel: usuario.papel, // Mantém papel como papel para consistência
      role: usuario.papel, // Também inclui role para compatibilidade frontend
      createdAt: usuario.createdAt
    });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

export const atualizarUsuarioById = async (req, res) => {
  try {
    const { nome, email, senha, papel } = req.body;
    
    // Validar se o ID é um ObjectId válido
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ erro: 'ID de usuário inválido' });
    }
    
    const usuario = await User.findOne({ _id: toObjectId(req.params.id), ativo: true });
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
    if (senha) {
      const hash = await bcrypt.hash(senha, 10);
      usuario.senha = hash;
    }
    usuario.nome = nome || usuario.nome;
    usuario.email = email || usuario.email;
    usuario.papel = papel || usuario.papel;
    await usuario.save();
    res.json({ mensagem: 'Usuário atualizado com sucesso', usuario });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

export const atualizarSenhaViaToken = async (req, res) => {
  try {
    const { token, novaSenha } = req.body;
    if (!token || !novaSenha) return res.status(400).json({ erro: 'Token e nova senha são obrigatórios' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo');
    const usuario = await User.findOne({ _id: decoded.id, ativo: true });
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
    const hash = await bcrypt.hash(novaSenha, 10);
    usuario.senha = hash;
    await usuario.save();
    res.json({ mensagem: 'Senha atualizada com sucesso' });
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ erro: 'Token inválido' });
    }
    res.status(400).json({ erro: err.message });
  }
};

export const atualizarPerfil = async (req, res) => {
  try {
    const { nome, email, senhaAtual, novaSenha, papel } = req.body;
    const userId = req.params.id || req.userId; // Suporta tanto URL param quanto token
    
    // Validar se o ID é um ObjectId válido
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ erro: 'ID de usuário inválido' });
    }
    
    const usuario = await User.findOne({ _id: toObjectId(userId), ativo: true });
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
    
    // Se está alterando senha, validar senha atual
    if (novaSenha) {
      if (!senhaAtual) {
        return res.status(400).json({ erro: 'Senha atual é obrigatória para alterar a senha' });
      }
      
      const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ erro: 'Senha atual incorreta' });
      }
      
      const hashNovaSenha = await bcrypt.hash(novaSenha, 10);
      usuario.senha = hashNovaSenha;
    }
    
    // Atualizar dados pessoais
    if (nome) usuario.nome = nome;
    if (email) {
      // Verificar se email já existe (exceto o próprio usuário)
      const emailExiste = await User.findOne({ 
        email, 
        _id: { $ne: toObjectId(userId) },
        ativo: true 
      });
      if (emailExiste) {
        return res.status(400).json({ erro: 'Este email já está em uso' });
      }
      usuario.email = email;
    }
    
    // Atualizar papel se fornecido
    if (papel) {
      usuario.papel = papel;
    }
    
    await usuario.save();
    
    // Retornar dados atualizados sem a senha
    const usuarioAtualizado = {
      id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      papel: usuario.papel,
      ativo: usuario.ativo,
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt
    };
    
    res.json({ 
      mensagem: 'Perfil atualizado com sucesso', 
      usuario: usuarioAtualizado 
    });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

export const  excluirUsuario = async (req, res) => {
  try {
    // Validar se o ID é um ObjectId válido
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ erro: 'ID de usuário inválido' });
    }
    
    const usuario = await User.findByIdAndUpdate(
      toObjectId(req.params.id), 
      { ativo: false }, 
      { new: true }
    );
    console.log('Desativando usuário:', usuario);
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.json({ mensagem: 'Usuário desativado com sucesso' });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

export const reativarUsuario = async (req, res) => {
  try {
    // Validar se o ID é um ObjectId válido
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ erro: 'ID de usuário inválido' });
    }
    
    const usuario = await User.findByIdAndUpdate(
      toObjectId(req.params.id), 
      { ativo: true }, 
      { new: true }
    );
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.json({ mensagem: 'Usuário reativado com sucesso', usuario });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

export const listarUsuariosInativos = async (req, res) => {
  try {
    const usuarios = await User.find({ ativo: false }).select('-senha');
    res.json(usuarios);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
