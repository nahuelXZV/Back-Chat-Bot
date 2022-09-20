const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({
  pizza: {
    type: mongoose.Types.ObjectId,
    ref: 'Pizza',
  },
  promocion: {
    type: mongoose.Types.ObjectId,
    ref: 'Promocion',
  },
  createdAt: {
    allowNull: false,
    type: Date,
    field: 'create_at',
    defaultValue: Date.now,
  },
});

const model = mongoose.model('Pizza_promocion', mySchema);
module.exports = model;
