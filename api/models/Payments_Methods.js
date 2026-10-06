const sequelize = require('../config/db');

const { DataTypes } = require('sequelize');

const PaymentsMethods = sequelize.define('PaymentsMethods', {
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
    types_payment_methods_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'types_payment_methods',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    responsible: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    number: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    expiration: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    CVV: {
      type: DataTypes.STRING(4),
      allowNull: false
    }
}, {
    timestamps: true,
    tableName: 'payments_methods'

});

module.exports = PaymentsMethods;