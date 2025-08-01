import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  papel: { type: String, enum: ['funcionario', 'administrador'], required: true },
  ativo: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
