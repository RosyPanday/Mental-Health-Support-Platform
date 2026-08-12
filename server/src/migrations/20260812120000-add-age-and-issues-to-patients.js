'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('patients', 'age', {
      type: Sequelize.INTEGER,
      allowNull:false,
    });
    await queryInterface.addColumn('patients', 'issues', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('patients', 'issues');
    await queryInterface.removeColumn('patients', 'age');
  },
};
