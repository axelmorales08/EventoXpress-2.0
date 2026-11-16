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
        type: DataTypes.STRING(64),
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    available_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'tickets'
});

module.exports = Ticket;