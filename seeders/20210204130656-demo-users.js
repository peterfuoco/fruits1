"use strict";
// stops at https://git.generalassemb.ly/john-deere-sei-7/sequelize-intro#3-add-seed-data-in-user
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "Tony Stark",
          username: "ironman",
          password: "prettyawesome",
        },
        {
          name: "Clark Kent",
          username: "superman",
          password: "canfly",
        },
        {
          name: "Bruce Wayne",
          username: "batman",
          password: "hasgadgets",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
  },
};
