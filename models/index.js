const Blog = require("./blog");
const User = require("./user");
const ReadingList = require("./reading_lists");
const BlogsReadingLists = require("./blogs_reading_lists");

User.hasMany(Blog);
Blog.belongsTo(User);

Blog.belongsToMany(ReadingList, { through: BlogsReadingLists });
ReadingList.belongsToMany(Blog, { through: BlogsReadingLists });

module.exports = {
  Blog,
  User,
  ReadingList,
  BlogsReadingLists,
};
