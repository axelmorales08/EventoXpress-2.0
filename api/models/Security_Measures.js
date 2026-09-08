const sequelize = require('../config/db');

const { DataTypes } = require('sequelize');

const SecurityMeasures = sequelize.define('SecurityMeasures', {
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
    venue_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'venues',
        key: 'id'
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    amount_security_personnel: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount_extinguishers: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    emergency_exits: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    amount_emergency_exits: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'security_measures'

});

module.exports = SecurityMeasures;