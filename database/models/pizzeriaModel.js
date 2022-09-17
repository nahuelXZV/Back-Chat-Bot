const { Model, DataTypes, Sequelize } = require('sequelize');

const PIZZERIA_TABLE = 'pizzeria';

const PizzeriaSchema = {
  id: {
    allowNull: false, // not null
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },  
  celular: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: Sequelize.NOW
  }
}

class Pizzeria extends Model {
  static associate(models) {
    // associations can be defined here
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PIZZERIA_TABLE,
      modelName: 'Pizzeria',
      timestamps: false
    }
  }
}


module.exports = { PIZZERIA_TABLE, PizzeriaSchema, Pizzeria }
