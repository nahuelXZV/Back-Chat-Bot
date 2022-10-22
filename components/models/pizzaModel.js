const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({
  nombre: {
    allowNull: false,
    type: String,
  },
  descripcion: {
    allowNull: false,
    type: String,
  },
  precio: {
    allowNull: false,
    type: Number,
  },
  tamano: {
    allowNull: false,
    type: String,
  },
  imagen: {
    allowNull: false,
    type: String,
  },
  createdAt: {
    allowNull: false,
    type: String,
    field: 'create_at',
  },
});

const model = mongoose.model('Pizza', mySchema);
module.exports = model;
