"use strict";
const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const fakeItems = [
      {
        name: "UCC No.117",
        description: "Instant coffee originates from Japan",
      },
      {
        name: "Blue Mountain",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        name: "Colombian Supremo",
        description:
          "Rich and full-bodied, with a balanced acidity and notes of chocolate and caramel.",
      },
      {
        name: "Guatemalan Antigua",
        description:
          "A complex and flavorful coffee with hints of cocoa, spice, and a smoky aroma.",
      },
      {
        name: "Sumatran Mandheling",
        description:
          "A heavy, syrupy coffee with earthy, herbal flavors and a rich, full body.",
      },
      {
        name: "Brazilian Santos",
        description:
          "Smooth and mild, with a nutty flavor and low acidity, perfect for any time of day.",
      },
      {
        name: "Jamaican Blue Mountain",
        description:
          "A luxurious and expensive coffee known for its mild flavor and smooth finish.",
      },
      {
        name: "Panama Geisha",
        description:
          "A highly sought-after coffee with a unique floral aroma and a delicate, tea-like flavor.",
      },
    ];

    await queryInterface.bulkInsert(
      "products",
      fakeItems.map((item) => ({
        name: item.name,
        description: item.description,
        price: faker.number.int({ min: 100000, max: 500000 }),
        stock: faker.number.int({ min: 50, max: 100 }),
        image_url: faker.image.url({ width: 600, height: 600 }),
        created_at: new Date(),
        updated_at: new Date(),
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("products", null, {});
  },
};
