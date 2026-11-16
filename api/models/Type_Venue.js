const sequelize = require('../config/db');

const { DataTypes } = require('sequelize');

const TypeVenue = sequelize.define('TypeVenue', {
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'type_venue'

});

module.exports = TypeVenue;