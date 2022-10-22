const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({
  montoTotal: {
    allowNull: false,
    type: Number,
    field: 'monto_total',
  },
  fecha: {
    allowNull: false,
    type: date,
  },
  clienteId: {
    allowNull: false,
    type: Schema.Types.ObjectId,
    ref: 'Cliente',
  },
  createdAt: {
    allowNull: false,
    type: Date,
    field: 'create_at',
  },
});

const model = mongoose.model('Pedido', mySchema);
module.exports = model;
