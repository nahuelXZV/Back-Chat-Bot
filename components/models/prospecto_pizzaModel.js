const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({
  pizza_id: {
    allowNull: false,
    type: mongoose.Types.ObjectId,
    ref: 'Pizza',
  },
  prospecto_id: {
    allowNull: false,
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

const model = mongoose.model('Prospecto_pizza', mySchema);
module.exports = model;
