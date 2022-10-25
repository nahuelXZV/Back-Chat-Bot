const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({
  prospectoId: {
    type: Schema.Types.ObjectId,
    ref: 'Prospecto',
    field: 'prospecto_id',
  },
  fecha: {
    allowNull: false,
    type: String,
  },
});

const model = mongoose.model('ProspectoIngreso', mySchema);
module.exports = model;
