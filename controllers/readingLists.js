const readingListRouter = require("express").Router();
const { ReadingList, BlogsReadingLists } = require("../models");
const { sequelize } = require("../util/db");

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

module.exports = readingListRouter;
