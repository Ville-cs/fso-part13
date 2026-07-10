const Blog = require("./blog");
const User = require("./user");
const Session = require("./session");
const ReadingList = require("./reading_lists");
const BlogsReadingLists = require("./blogs_reading_lists");

User.hasOne(Session);
User.hasMany(Blog);
User.hasMany(ReadingList);
Blog.belongsTo(User);

Blog.belongsToMany(ReadingList, { through: BlogsReadingLists });
ReadingList.belongsToMany(Blog, { through: BlogsReadingLists });

module.exports = {
  Blog,
  User,
  Session,
  ReadingList,
  BlogsReadingLists,
};
