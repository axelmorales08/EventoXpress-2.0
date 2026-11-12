const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const Ticket = sequelize.define('Ticket', {
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
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false, // Cámbialo a true si deseas que Sequelize gestione automáticamente createdAt y updatedAt
  tableName: 'tickets'
});

module.exports = Ticket;