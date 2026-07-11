const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("reading_lists", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
    });
    await queryInterface.createTable("blogs_reading_lists", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      blog_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "blogs", key: "id" },
      },
      reading_list_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "reading_lists", key: "id" },
      },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable("blogs_reading_lists");
    await queryInterface.dropTable("reading_lists");
  },
};
