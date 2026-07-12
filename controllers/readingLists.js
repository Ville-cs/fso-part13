const readingListRouter = require("express").Router();
const { ReadingList, BlogReadingList, User, Blog } = require("../models");
const { sequelize } = require("../util/db");
const { userExtractor } = require("../util/middleware");

readingListRouter.post("/", async (req, res, next) => {
  const body = req.body;
  const t = await sequelize.transaction();
  try {
    const duplicate = await BlogReadingList.findOne({
      where: {
        blogId: body.blogId,
      },
      include: {
        model: ReadingList,
        where: {
          userId: body.userId,
        },
      },
    });
    if (duplicate) {
      return res
        .status(400)
        .json({ error: "same blog cannot be added by same user twice" });
    }

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

    const readingList = await ReadingList.create(
      { userId: body.userId },
      { transaction: t },
    );
    await readingList.addBlog(body.blogId, { transaction: t });
    await t.commit();
    res.status(201).json(readingList);
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
    readingList.setDataValue("read", req.body.read);
    readingList.save();
    res.status(200).json(readingList);
  } catch (error) {
    next(error);
  }
});

module.exports = readingListRouter;
