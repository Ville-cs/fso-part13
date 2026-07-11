const readingListRouter = require("express").Router();
const { ReadingList, Blog, BlogsReadingLists } = require("../models");
const { sequelize } = require("../util/db");
const { userExtractor, sessionExtractor } = require("../util/middleware");

readingListRouter.post("/", async (req, res, next) => {
  const body = req.body;
  const t = await sequelize.transaction();
  try {
    const readingList = await ReadingList.create(
      { userId: body.userId },
      {
        transaction: t,
      },
    );
    const blogJoin = await readingList.addBlog(body.blogId, { transaction: t });
    await t.commit();
    const toReturn = {
      id: readingList.id,
      read: blogJoin[0].dataValues.read,
      user_id: readingList.userId,
      blog_id: blogJoin[0].dataValues.blogId,
    };
    res.status(201).json(toReturn);
  } catch (error) {
    await t.rollback();
    next(error);
  }
});

readingListRouter.put(
  "/:id",
  userExtractor,
  sessionExtractor,
  async (req, res, next) => {
    const user = req.user;
    try {
      const readingList = await ReadingList.findByPk(req.params.id);
      const joinTable = await BlogsReadingLists.findOne({
        where: {
          readingListId: req.params.id,
        },
      });
      joinTable.read = req.body.read;
      joinTable.save();

      if (!readingList) {
        return res.status(404).json({ error: "reading list not found" });
      }
      if (readingList.userId !== user.id) {
        return res.status(401).json({ error: "invalid user" });
      }

      readingList.setDataValue("read", joinTable.read);
      res.status(200).json(readingList);
    } catch (error) {
      next(error);
    }
  },
);

module.exports = readingListRouter;
