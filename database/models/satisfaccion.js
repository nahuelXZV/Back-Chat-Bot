const { Model, DataTypes, Sequelize } = require('sequelize');

const SATISFACCION_TABLE = 'satisfaccion';

const SatisfaccionSchema = {
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
}

class Satisfaccion extends Model {
  static associate(models) {
    // associations can be defined here
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: SATISFACCION_TABLE,
      modelName: 'Satisfaccion',
      timestamps: false
    }
  }
}


module.exports = { SATISFACCION_TABLE, SatisfaccionSchema, Satisfaccion }
