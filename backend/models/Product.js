import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  codigo: { type: String, required: true, unique: true },
  marca: { type: String, required: true },
  preco: { type: Number, required: true },
  quantidade: { type: Number, required: true },
  ativo: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
 