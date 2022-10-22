const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({
  nombre: {
    allowNull: false,
    type: String,
  },
  foto: {
    allowNull: false,
    type: String,
  },
  correo: {
    allowNull: true,
    type: String,
  },
  facebookId: {
    allowNull: false,
    type: String,
    field: 'facebook_id',
  },
  createdAt: {
    allowNull: false,
    type: String,
    field: 'create_at',
  },
});

const model = mongoose.model('Prospecto', mySchema);
module.exports = model;
