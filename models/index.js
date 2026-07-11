const Blog = require("./blog");
const User = require("./user");
const Session = require("./session");
const ReadingList = require("./reading_lists");
const BlogsReadingLists = require("./blogs_reading_lists");

User.hasOne(Session, {
  foreignKey: "userId",
});
Session.belongsTo(User, {
  foreignKey: "userId",
});

User.hasMany(ReadingList, {
  foreignKey: "userId",
});
ReadingList.belongsTo(User, {
  foreignKey: "userId",
});

User.hasMany(Blog, {
  foreignKey: "userId",
});
Blog.belongsTo(User, {
  foreignKey: "userId",
});

Blog.belongsToMany(ReadingList, {
  through: BlogsReadingLists,
  foreignKey: "blogId",
});
ReadingList.belongsToMany(Blog, {
  through: BlogsReadingLists,
  foreignKey: "readingListId",
});

module.exports = {
  Blog,
  User,
  Session,
  ReadingList,
  BlogsReadingLists,
};
