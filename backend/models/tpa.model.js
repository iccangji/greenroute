const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Tpa = sequelize.define('Tpa', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tpa: {
        type: DataTypes.STRING,
        allowNull: false
    },
    latitude: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    longitude: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }
}, {
    tableName: 'tpa',
    timestamps: true,
}
);

module.exports = Tpa;