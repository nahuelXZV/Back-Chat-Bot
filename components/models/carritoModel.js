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
    type: String,
  },
  clienteId: {
    allowNull: false,
    type: Schema.Types.ObjectId,
    ref: 'Cliente',
  },
  prospectoId: {
    allowNull: false,
    type: Schema.Types.ObjectId,
    ref: 'Prospecto',
  },
});

const model = mongoose.model('Carrito', mySchema);
module.exports = model;
