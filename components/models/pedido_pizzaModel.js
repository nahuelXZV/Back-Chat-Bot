const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({
  cantidad: {
    allowNull: false,
    type: Number,
  },
  precio: {
    allowNull: false,
    type: Number,
  },
  pizzaId: {
    type: Schema.Types.ObjectId,
    ref: 'Pizza',
    field: 'pizza_id',
  },
  pedidoId: {
    type: Schema.Types.ObjectId,
    ref: 'Pedido',
    field: 'pedido_id',
  },
  createdAt: {
    allowNull: false,
    type: Date,
    field: 'create_at',
  },
});

const model = mongoose.model('PedidoPizza', mySchema);
module.exports = model;
