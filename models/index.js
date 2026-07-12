const Blog = require("./blog");
const User = require("./user");
const Session = require("./session");
const ReadingList = require("./reading_lists");
const BlogReadingList = require("./blog_reading_list");

User.hasOne(Session, {
  foreignKey: "userId",
});
Session.belongsTo(User, {
  foreignKey: "userId",
});

User.hasOne(ReadingList, {
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
  through: BlogReadingList,
  foreignKey: "blogId",
});
ReadingList.belongsToMany(Blog, {
  through: BlogReadingList,
  foreignKey: "readingListId",
});

module.exports = {
  Blog,
  User,
  Session,
  ReadingList,
  BlogReadingList,
};
