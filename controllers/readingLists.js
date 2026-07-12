const readingListRouter = require("express").Router();
const { ReadingList, BlogReadingList, User, Blog } = require("../models");
const { sequelize } = require("../util/db");
const { userExtractor } = require("../util/middleware");

readingListRouter.post("/", async (req, res, next) => {
  const body = req.body;
  const t = await sequelize.transaction();
  try {
    if (!body.userId || !body.blogId) {
      return res
        .status(400)
        .json({ error: "userId and blogId must be attached" });
    }
    const user = await User.findByPk(body.userId);
    const blog = await Blog.findByPk(body.blogId);
    if (!user || !blog) {
      return res.status(404).json({ error: "user or blog not found" });
    }

    let readingList = await ReadingList.findOne({
      where: {
        userId: body.userId,
      },
    });
    if (!readingList) {
      readingList = await ReadingList.create(
        { userId: body.userId },
        { transaction: t },
      );
    }
    const blogJoin = await BlogReadingList.create(
      {
        blogId: body.blogId,
        readingListId: readingList.id,
      },
      {
        transaction: t,
      },
    );
    const toReturn = {
      id: readingList.id,
      read: blogJoin.read,
      user_id: readingList.userId,
      blog_id: blogJoin.blogId,
    };
    await t.commit();
    res.status(201).json(toReturn);
  } catch (error) {
    await t.rollback();
    next(error);
  }
});

readingListRouter.put("/:id", userExtractor, async (req, res, next) => {
  const user = req.user;
  try {
    const readingList = await ReadingList.findByPk(req.params.id);
    if (!readingList) {
      return res.status(404).json({ error: "reading list not found" });
    }
    if (readingList.userId !== user.id) {
      return res.status(401).json({ error: "invalid user" });
    }
    const joinTable = await BlogReadingList.findOne({
      where: {
        readingListId: req.params.id,
      },
    });
    joinTable.read = req.body.read;
    joinTable.save();

    readingList.setDataValue("read", joinTable.read);
    res.status(200).json(readingList);
  } catch (error) {
    next(error);
  }
});

module.exports = readingListRouter;
