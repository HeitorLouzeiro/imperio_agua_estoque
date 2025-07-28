import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
    const usuario = await User.findOne({ email });
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
    const usuarios = await User.find().select('-senha');
    res.json(usuarios);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

export const obterPerfil = async (req, res) => {
  try {
    const usuario = await User.findById(req.userId).select('-senha');
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.json({
      id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.papel, // Mapear 'papel' para 'tipo' para manter consistência no frontend
      createdAt: usuario.createdAt
    });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

export const atualizarUsuarioById = async (req, res) => {
  try {
    const { nome, email, senha, papel } = req.body;
    const usuario = await User.findById(req.params.id);
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
    const usuario = await User.findById(decoded.id);
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


export const  excluirUsuario = async (req, res) => {
  try {
    const usuario = await User.findByIdAndDelete(req.params.id);
    console.error('Excluindo usuário:', usuario);
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.json({ mensagem: 'Usuário excluído com sucesso' });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}
