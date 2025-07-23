import jwt from 'jsonwebtoken';

export const autenticar = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ erro: 'Token não fornecido' });
  jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'segredo', (err, decoded) => {
    if (err) return res.status(401).json({ erro: 'Token inválido' });
    req.userId = decoded.id; // Extrair o ID do usuário do token
    req.userRole = decoded.papel; // Extrair o papel do usuário
    next();
  });
};
