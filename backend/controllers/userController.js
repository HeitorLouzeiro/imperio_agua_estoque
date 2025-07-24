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
