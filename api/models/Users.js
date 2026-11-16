const sequelize = require('../config/db');

const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    type_users_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'type_users',
            key: 'id',
        },
    },
    gender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'genders',
            key: 'id',
        },
    },
    full_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    user_name: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true
    },
    dni: {
        type: DataTypes.STRING(20), 
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    photo: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'users',
    timestamps: true,      // paranoid solo funciona con timestamps: true
    createdAt: 'created_at',
    updatedAt: false,      // no existe la columna updated_at en la tabla
    paranoid: true,        // borrado lógico mediante deleted_at
    deletedAt: 'deleted_at',
    underscored: true,
});

module.exports = User;