const sequelize = require('../config/db');

const { DataTypes } = require('sequelize');

const Category = sequelize.define('Category', {
    name: {
        type: DataTypes.STRING(64),
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'categories'

});

module.exports = Category;