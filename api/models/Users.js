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
    type_gender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'genders',
            key: 'id',
        },
    },
    full_name: {
        type: DataTypes.STRING(255),
        allowNull:false
    },
    user_name: {
        type: DataTypes.STRING(64),
        allowNull: false
    },
    dni: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
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
    timestamps: false,
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: false, // Desactivado porque no existe la columna en la tabla SQL
    paranoid: true, // Habilita borrado lógico mediante deleted_at
    deletedAt: 'deleted_at',
    underscored: true,
});

module.exports = User;