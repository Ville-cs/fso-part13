const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../util/db");

class BlogReadingList extends Model {}

BlogReadingList.init(
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
    modelName: "blog_reading_list",
    indexes: [
      {
        unique: true,
        fields: ["blog_id", "reading_list_id"],
      },
    ],
  },
);

module.exports = BlogReadingList;
