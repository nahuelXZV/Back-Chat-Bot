const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({
  prospecto_id: {
    type: mongoose.Types.ObjectId,
    ref: 'Prospecto',
  },
  createdAt: {
    allowNull: false,
    type: Date,
    field: 'create_at',
    defaultValue: Date.now,
  },
});

const model = mongoose.model('Prospecto_ingreso', mySchema);
module.exports = model;
