const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({
  nombre: {
    allowNull: false,
    type: String,
    unique: true,
  },
  telefono: {
    allowNull: true,
    type: String,
    unique: true,
  },
  correo: {
    allowNull: true,
    type: String,
    unique: true,
  },
  createdAt: {
    allowNull: false,
    type: Date,
    field: 'create_at',
    defaultValue: Date.now,
  },
});

const model = mongoose.model('Cliente', mySchema);
module.exports = model;
