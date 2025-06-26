const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Tps = sequelize.define('Tps', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tps: {
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
    },
    volume_sampah: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }
}, {
    tableName: 'tps',
    timestamps: true,
});

module.exports = Tps;