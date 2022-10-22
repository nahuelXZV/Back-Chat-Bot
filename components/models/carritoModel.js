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
});

const model = mongoose.model('Carrito', mySchema);
module.exports = model;
