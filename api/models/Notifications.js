const sequelize = require('../config/db');

const { DataTypes } = require('sequelize');

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    venue_id: {
        type: DataTypes.INTEGER,
        allowNull: true,   // puede ser una notificación general, sin evento
        references: {
            model: 'venues',
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'notifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true,
});

module.exports = Notification;
