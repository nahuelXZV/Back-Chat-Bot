const { Model, DataTypes, Sequelize } = require('sequelize');

const SUCURSAL_TABLE = 'sucursal';

const SucursalSchema = {
  id: {
    allowNull: false, // not null
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  direccion: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  telefono: {
    allowNull: false,
    type: DataTypes.INTEGER,
    unique: true,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: Sequelize.NOW
  }
}

class Sucursal extends Model {
  static associate(models) {
    // associations can be defined here
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: SUCURSAL_TABLE,
      modelName: 'Sucursal',
      timestamps: false
    }
  }
}


module.exports = { SUCURSAL_TABLE, SucursalSchema, Sucursal }
