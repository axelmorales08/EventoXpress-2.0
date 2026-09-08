const sequelize = require('../config/db');

const { DataTypes } = require('sequelize');

const TypePaymentMethods = sequelize.define('TypePaymentMethods', {
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'type_payment_methods'

});

module.exports = TypePaymentMethods;