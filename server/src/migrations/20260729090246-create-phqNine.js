"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("phq_nine_results", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // If User is hard-deleted, their results is automatically hard-deleted too
      },
      patient_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "patients",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      responses: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: false,
      },
      total_score: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      severity: {
        type: Sequelize.ENUM(
          "none",
          "mild",
          "moderate",
          "moderately severe",
          "severe",
        ),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("phq_nine_results");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_phq_nine_results_severity";',
    );
  },
};
