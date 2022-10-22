const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({
  nombre: {
    allowNull: false,
    type: String,
    unique: true,
  },
  correo: {
    allowNull: false,
    type: String,
    unique: true,
  },
  celular: {
    allowNull: false,
    type: String,
    unique: true,
  },
  direccion: {
    allowNull: false,
    type: String,
  },
  url: {
    allowNull: false,
    type: String,
  },
  createdAt: {
    allowNull: false,
    type: Date,
    field: 'create_at',
  },
});

const model = mongoose.model('Pizzeria', mySchema);
module.exports = model;
