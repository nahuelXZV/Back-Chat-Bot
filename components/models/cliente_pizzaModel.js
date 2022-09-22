const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({
  pizza_id: {
    allowNull: false,
    type: mongoose.Types.ObjectId,
  },
  cliente_id: {
    allowNull: false,
    type: mongoose.Types.ObjectId,
  },
  createdAt: {
    allowNull: false,
    type: Date,
    field: 'create_at',
    defaultValue: Date.now,
  },
});

const model = mongoose.model('Cliente_pizza', mySchema);
module.exports = model;
