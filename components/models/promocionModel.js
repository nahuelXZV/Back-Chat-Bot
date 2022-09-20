const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const model = mongoose.model('Promocion', mySchema);
module.exports = model;