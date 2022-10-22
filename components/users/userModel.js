const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  recoveryToken: String,
  role: {
    type: String,
    required: true,
    default: 'public',
  },
  tipo: {
    type: String,
    required: true,
  },
  empleadoId: {
    allowNull: true,
    type: Schema.Types.ObjectId,
    ref: 'Empleado',
  },
  clienteId: {
    allowNull: true,
    type: Schema.Types.ObjectId,
    ref: 'Cliente',
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const model = mongoose.model('User', mySchema);
module.exports = model;
