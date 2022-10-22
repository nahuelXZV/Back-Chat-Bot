const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({
  tipoComunicacion: {
    allowNull: false,
    type: String,
    field: 'tipo_comunicacion',
  },
  descripcion: {
    allowNull: false,
    type: String,
  },
  clienteId: {
    allowNull: false,
    type: Schema.Types.ObjectId,
    ref: 'Cliente',
  },
  empleadoId: {
    allowNull: false,
    type: Schema.Types.ObjectId,
    ref: 'Empleado',
  },
  fecha: {
    allowNull: false,
    type: String,
  },
});

const model = mongoose.model('Contacto', mySchema);
module.exports = model;
