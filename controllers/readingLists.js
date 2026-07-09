const readingListRouter = require("express").Router();
const { ReadingList } = require("../models");

readingListRouter.post("/", async (req, res, next) => {
  const body = req.body;
  try {
    const readingList = await ReadingList.create({
      ...body,
    });
    res.status(201).json(readingList);
  } catch (error) {
    return next(error);
  }
});

module.exports = readingListRouter;
