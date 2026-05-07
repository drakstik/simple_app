'use strict';
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Users', {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  });
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Users');
}