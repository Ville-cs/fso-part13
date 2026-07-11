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
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "blogs_reading_list",
  },
);

module.exports = BlogsReadingLists;
