module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("reading_lists", "read");
    await queryInterface.removeColumn("blogs_reading_lists", "read");
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("reading_lists", "read");
    await queryInterface.dropTable("reading_lists");
  },
};
