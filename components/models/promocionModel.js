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
  fechaInicio: {
    allowNull: false,
    type: Date,
    field: 'fecha_inicio',
  },
  fechaFin: {
    allowNull: false,
    type: Date,
    field: 'fecha_fin',
  },
  createdAt: {
    allowNull: false,
    type: Date,
    field: 'create_at',
  },
});

const model = mongoose.model('Promocion', mySchema);
module.exports = model;
