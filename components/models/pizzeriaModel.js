const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({
  id: {
    allowNull: false, // not null
    autoIncrement: true,
    primaryKey: true,
    type: Number,
    required: true,
  },
  nombre: {
    allowNull: false,
    type: String,
    unique: true,
    required: true,
  },
  correo: {
    allowNull: false,
    type: String,
    unique: true,
    required: false,
  },
  celular: {
    allowNull: false,
    type: String,
    unique: true,
    required: true,
  },
  direccion: {
    allowNull: false,
    type: String,
    required: true,
  },
  url: {
    allowNull: false,
    type: String,
    required: true,
  },
  createdAt: {
    allowNull: false,
    type: Date,
    field: 'create_at',
    defaultValue: Date.now,
  },
});

const model = mongoose.model('Pizzeria', mySchema);
module.exports = model;
