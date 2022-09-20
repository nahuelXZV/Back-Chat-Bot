const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  recoveryToken: String,
  role: {
    type: String,
    required: true,
    default: 'public',
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const model = mongoose.model('User', mySchema);
module.exports = model;
