const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({
  nombre: {
    type: String,
  },
  foto: {
    type: String,
  },
  correo: {
    allowNull: true,
    type: String,
  },
  idUser: {
    allowNull: false,
    type: String,
  },
  createdAt: {
    allowNull: false,
    type: Date,
    field: 'create_at',
    defaultValue: Date.now,
  },
});

const model = mongoose.model('Prospecto', mySchema);
module.exports = model;
