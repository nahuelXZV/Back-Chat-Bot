const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({
  opinion: {
    allowNull: false,
    type: String,
  },
  valoracion: {
    allowNull: false,
    type: String,
  },
  clienteId: {
    allowNull: false,
    type: Schema.Types.ObjectId,
    ref: 'Cliente',
    field: 'cliente_id',
  },
  fecha: {
    allowNull: false,
    type: String,
  },
});

const model = mongoose.model('Satisfaccion', mySchema);
module.exports = model;
