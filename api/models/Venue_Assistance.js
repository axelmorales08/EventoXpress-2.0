const sequelize = require('../config/db');

const { DataTypes } = require('sequelize');

const VenueAssistance = sequelize.define('VenueAssistance', {
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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
}, {
    timestamps: false,
    tableName: 'venue_assistance'

});

module.exports = VenueAssistance;