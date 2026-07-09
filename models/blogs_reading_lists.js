const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../util/db");

class BlogsReadingLists extends Model {}

BlogsReadingLists.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "blogs", key: "id" },
    },
    readingListId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "reading_lists", key: "id" },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "blogs_reading_list",
  },
);

module.exports = BlogsReadingLists;
