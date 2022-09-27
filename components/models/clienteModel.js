const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({
  nombre: {
    allowNull: true,
    type: String,
  },
  telefono: {
    allowNull: true,
    type: String,
  },
  correo: {
    allowNull: true,
    type: String,
  },
  tipo: {
    allowNull: true,
    type: String,
  },
  idUser: {
    allowNull: false,
    type: String,
  },
  prospecto_id: {
    allowNull: true,
    type: mongoose.Types.ObjectId,
    field: 'prospecto_id',
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
