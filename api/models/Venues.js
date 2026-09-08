const sequelize = require('../config/db');

const { DataTypes } = require('sequelize');

const Venue = sequelize.define('Venue', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type_venue_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'type_venue',
        key: 'id',
      },
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    province: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    locality: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    beginning: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    ending: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    state: {
      type: DataTypes.ENUM('publico', 'en proceso'),
      allowNull: false,
      defaultValue: 'en proceso',
    },
    published: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    suitable_for_all_audiences: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
    
  }, {
    tableName: 'venues',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false, // Desactivado porque no existe la columna en la tabla SQL
    paranoid: true, // Habilita borrado lógico mediante deleted_at
    deletedAt: 'deleted_at',
    underscored: true,
  });

  Venue.associate = (models) => {
    Venue.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Venue.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
    });
    Venue.belongsTo(models.TypeVenue, {
      foreignKey: 'type_venue_id',
      as: 'typeVenue',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

module.exports = Venue;