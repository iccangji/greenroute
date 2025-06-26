'use strict';
const { hash: hashPassword } = require('../utils/auth/password');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const hashedPassword = hashPassword('admin123');

    await queryInterface.bulkInsert('Users', [{
      name: 'admin',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', { email: 'admin@example.com' });
  }
};
