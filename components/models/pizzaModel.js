const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({
  nombre: {
    allowNull: false,
    type: DataTypes.STRING,
    required: true,
  },
  descripcion: {
    allowNull: false,
    type: DataTypes.STRING,
    required: false,
  },
  precio: {
    type: DataTypes.NUMBER,
    required: true,
  },
  tamano: {
    type: DataTypes.STRING,
    required: true,
  },
  imagen: {
    type: DataTypes.STRING,
    required: false,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const model = mongoose.model('Pizza', mySchema);
module.exports = model;
