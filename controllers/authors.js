const authorRouter = require("express").Router();
const { Blog } = require("../models");
const { fn, col } = require("sequelize");

authorRouter.get("/", async (req, res) => {
  try {
    const authors = await Blog.findAll({
      attributes: [
        "author",
        [fn("COUNT", col("id")), "blogs"],
        [fn("SUM", col("likes")), "likes"],
      ],
      group: ["author"],
      order: [[fn("SUM", col("likes")), "DESC"]],
      raw: true,
    });
    res.status(200).json(authors);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = authorRouter;
