const sequelize = require('../config/db');

const { DataTypes } = require('sequelize');

const TypeUser = sequelize.define('TypeUser', {
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'type_users'

});

module.exports = TypeUser;