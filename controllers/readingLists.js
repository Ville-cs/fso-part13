const readingListRouter = require("express").Router();
const { ReadingList, BlogsReadingLists } = require("../models");
const { sequelize } = require("../util/db");
const { userExtractor, sessionExtractor } = require("../util/middleware");

readingListRouter.post("/", async (req, res, next) => {
  const body = req.body;
  const t = await sequelize.transaction();
  try {
    const readingList = await ReadingList.create(
      {
        ...body,
      },
      { transaction: t },
    );
    await BlogsReadingLists.create(
      {
        readingListId: readingList.id,
        blogId: body.blogId,
      },
      { transaction: t },
    );
    await t.commit();
    res.status(201).json(readingList);
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
      if (!readingList) {
        return res.status(404).json({ error: "reading list not found" });
      }
      if (readingList.userId !== user.id) {
        return res.status(401).json({ error: "invalid user" });
      }
      readingList.read = req.body.read;
      await readingList.save();
      res.status(200).json(readingList);
    } catch (error) {
      next(error);
    }
  },
);

module.exports = readingListRouter;
