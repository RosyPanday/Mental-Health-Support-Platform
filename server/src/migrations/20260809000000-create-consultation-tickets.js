'use strict';
module.exports = { async up(queryInterface, Sequelize) { await queryInterface.createTable('consultation_tickets', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
  patient_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'patients', key: 'id' }, onDelete: 'CASCADE' },
  therapist_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'therapists', key: 'id' }, onDelete: 'CASCADE' },
  amount: { type: Sequelize.INTEGER, allowNull: false }, status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'INITIATED' },
  pidx: { type: Sequelize.STRING, unique: true, allowNull: true }, transaction_id: { type: Sequelize.STRING, allowNull: true }, order_id: { type: Sequelize.STRING, unique: true, allowNull: false },
  created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }, updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }, deleted_at: { type: Sequelize.DATE, allowNull: true },
}); }, async down(queryInterface) { await queryInterface.dropTable('consultation_tickets'); } };
