const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({
  id: {
    allowNull: false, // not null
    autoIncrement: true,
    primaryKey: true,
    type: Number
  },
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
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: Sequelize.NOW
  }
});

const model = mongoose.model('Pizzeria', mySchema);
module.exports = model;
