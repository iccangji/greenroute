const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Rute = sequelize.define('Rute', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    armada: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rute_tps: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rute_koordinat: {
        type: DataTypes.STRING,
        allowNull: false
    },
    jarak_tempuh: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    muatan: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }
}, {
    tableName: 'rute',
    timestamps: true,
});

module.exports = Rute;