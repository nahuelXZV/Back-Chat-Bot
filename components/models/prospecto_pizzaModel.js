const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({
  pizzaId: {
    allowNull: false,
    type: Schema.Types.ObjectId,
    ref: 'Pizza',
    field: 'pizza_id',
  },
  prospectoId: {
    allowNull: false,
    type: Schema.Types.ObjectId,
    ref: 'Prospecto',
    field: 'prospecto_id',
  },
  fecha: {
    allowNull: false,
    type: String,
  },
});

const model = mongoose.model('ProspectoPizza', mySchema);
module.exports = model;
