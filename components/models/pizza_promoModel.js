const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({
  pizzaId: {
    type: Schema.Types.ObjectId,
    ref: 'Pizza',
    field: 'pizza_id',
  },
  promocionId: {
    type: Schema.Types.ObjectId,
    ref: 'Promocion',
    field: 'promocion_id',
  },
  createdAt: {
    allowNull: false,
    type: Date,
    field: 'create_at',
  },
});

const model = mongoose.model('PizzaPromo', mySchema);
module.exports = model;
