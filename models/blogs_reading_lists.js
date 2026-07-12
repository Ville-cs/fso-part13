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
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    readingListId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "blogs_reading_list",
    indexes: [
      {
        unique: true,
        fields: ["blog_id", "reading_list_id"],
      },
    ],
  },
);

module.exports = BlogsReadingLists;
