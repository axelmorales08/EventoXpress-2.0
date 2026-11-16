const sequelize = require('../config/db');

const { DataTypes } = require('sequelize');

const OwnerAuthorization = sequelize.define('OwnerAuthorization', {
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
    owner_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    owner_dni: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    residential_address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    document: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'owner_authorization'

});

module.exports = OwnerAuthorization;