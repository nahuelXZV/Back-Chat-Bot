const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({
  opinion: {
    allowNull: false,
    type: String,
  },
  cliente_id: {
    allowNull: false,
    type: mongoose.Types.ObjectId,
    ref: 'Cliente',
  },
  createdAt: {
    allowNull: false,
    type: Date,
    field: 'create_at',
    defaultValue: Date.now,
  },
});

const model = mongoose.model('Satisfaccion', mySchema);
module.exports = model;
