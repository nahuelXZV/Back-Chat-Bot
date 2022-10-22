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
  FacebookId: {
    allowNull: false,
    type: String,
    field: 'facebook_id',
  },
  prospectoId: {
    allowNull: true,
    field: 'prospecto_id',
    type: Schema.Types.ObjectId,
    ref: 'Prospecto',
  },
  createdAt: {
    allowNull: false,
    type: Date,
    field: 'create_at',
  },
});

const model = mongoose.model('Cliente', mySchema);
module.exports = model;
