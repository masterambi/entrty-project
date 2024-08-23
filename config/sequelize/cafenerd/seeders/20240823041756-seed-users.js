"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(`users`, [
      {
        email: "admin@mail.com",
        password: await bcrypt.hash("Pass12345", await bcrypt.genSalt(10)),
        name: "Admin",
        role: "admin",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "customer@mail.com",
        password: await bcrypt.hash("Pass12345", await bcrypt.genSalt(10)),
        name: "Customer",
        role: "customer",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
