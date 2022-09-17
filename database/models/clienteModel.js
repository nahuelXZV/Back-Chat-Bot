const { Model, DataTypes, Sequelize } = require('sequelize');

const CLIENTE_TABLE = 'cliente';

const ClienteSchema = {
  id_cliente: {
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
  celular: {
    allowNull: true,
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

class Cliente extends Model {
  static associate(models) {
    // associations can be defined here
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CLIENTE_TABLE,
      modelName: 'Cliente',
      timestamps: false
    }
  }
}


module.exports = { CLIENTE_TABLE, ClienteSchema, Cliente }
