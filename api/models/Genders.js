const sequelize = require('../config/db');

const { DataTypes } = require('sequelize');

const Gender = sequelize.define('Gender', {
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
    gendername: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
    timestamps: false,
    tableName: 'genders'

});

module.exports = Gender;