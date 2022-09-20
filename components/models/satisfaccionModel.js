const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({
  id: {
    allowNull: false, // not null
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  opinion: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  cliente_id: {
    allowNull: false,
    type: DataTypes.INTEGER
  },  
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: Sequelize.NOW
  }
});

const model = mongoose.model('Satisfaccion', mySchema);
module.exports = model;