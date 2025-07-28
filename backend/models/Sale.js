import mongoose from 'mongoose';

const itemVendaSchema = new mongoose.Schema({
  produto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantidade: {
    type: Number,
    required: true,
    min: 1
  },
  precoUnitario: {
    type: Number,
    required: true,
    min: 0
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  }
});

const vendaSchema = new mongoose.Schema({
  numero: {
    type: String,
    required: true,
    unique: true
  },
  cliente: {
    type: String,
    required: true
  },
  vendedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itens: {
    type: [itemVendaSchema],
    validate: [v => v.length > 0, 'A venda precisa ter ao menos um item.']
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  desconto: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  formaPagamento: {
    type: String,
    required: true,
    enum: ['dinheiro', 'cartao_debito', 'cartao_credito', 'pix', 'transferencia']
  },
  status: {
    type: String,
    required: true,
    enum: ['pendente', 'paga', 'cancelada'],
    default: 'paga'
  },
  observacoes: {
    type: String
  },
  dataVenda: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

vendaSchema.pre('save', async function (next) {
  try {
    // Gerar número da venda
    if (!this.numero) {
      const count = await mongoose.model('Sale').countDocuments();
      this.numero = `V${String(count + 1).padStart(6, '0')}`;
    }

    // Calcular subtotal e total
    this.subtotal = this.itens.reduce((acc, item) => acc + item.subtotal, 0);
    this.total = this.subtotal - this.desconto;

    next();
  } catch (err) {
    next(err);
  }
});


export default mongoose.model('Sale', vendaSchema);
