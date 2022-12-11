const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({
  clienteId: {
    type: Schema.Types.ObjectId,
    ref: 'Cliente',
    field: 'cliente_id',
  },
  promocionId: {
    type: Schema.Types.ObjectId,
    ref: 'Promocion',
    field: 'promocion_id',
  },
  fecha: {
    allowNull: false,
    type: String,
  },
});

const model = mongoose.model('ClienteNotificar', mySchema);
module.exports = model;
