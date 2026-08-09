"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_users_role"
      ADD VALUE IF NOT EXISTS 'admin';
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `
        ALTER TYPE "enum_users_role"
        RENAME TO "enum_users_role_old";
      `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `
        CREATE TYPE "enum_users_role" AS ENUM ('patient', 'therapist');
      `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `
        ALTER TABLE "users"
        ALTER COLUMN "role"
        TYPE "enum_users_role"
        USING (
          CASE 
            WHEN "role"::text = 'admin' THEN 'patient'::"enum_users_role"
            ELSE "role"::text::"enum_users_role"
          END
        );
      `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `
        DROP TYPE "enum_users_role_old";
      `,
        { transaction },
      );
    });
  },
};
