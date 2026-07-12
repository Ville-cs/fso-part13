const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("reading_lists", {
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
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
    });
    await queryInterface.createTable("blog_reading_lists", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    await queryInterface.addIndex("blog_reading_lists", {
      fields: ["blog_id", "reading_list_id"],
      unique: true,
      name: "unique_blog_reading_list",
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeIndex(
      "blog_reading_lists",
      "unique_blog_reading_list",
    );
    await queryInterface.dropTable("blog_reading_lists");
    await queryInterface.dropTable("reading_lists");
  },
};
