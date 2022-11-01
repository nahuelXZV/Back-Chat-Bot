const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({  
  nombre: {
    allowNull: true,
    type: String,
  },
  direccion: {
    allowNull: true,
    type: String,
  },
  telefono: {
    allowNull: true,
    type: String,
  },
  createdAt: {
    allowNull: false,
    type: String,
    field: 'create_at',
  },
});

const model = mongoose.model('Empleado', mySchema);
module.exports = model;
