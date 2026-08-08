"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("request_consultations", "room_name", {
      type: Sequelize.STRING,
      allowNull: true, // NULL until therapist confirms the request
    });

    await queryInterface.addColumn("request_consultations", "call_status", {
      type: Sequelize.ENUM("scheduled", "ongoing", "completed"),
      allowNull: false,
      defaultValue: "scheduled",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("request_consultations", "room_name");
    await queryInterface.removeColumn("request_consultations", "call_status");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_request_consultations_call_status";',
    );
  },
};
