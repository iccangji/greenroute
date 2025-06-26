'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Tpa', [
      { tpa: 'TPA Puuwatu', latitude: -3.9895365072936024, longitude: 122.46829544712013, createdAt: new Date(), updatedAt: new Date() }
    ]);
  }
};
