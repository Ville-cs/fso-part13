const blogsRouter = require("express").Router();
const { Blog, User, Session } = require("../models");
const {
  blogFinder,
  userExtractor,
  sessionExtractor,
} = require("../util/middleware");
const { Op } = require("sequelize");

blogsRouter.get("/", async (req, res) => {
  const where = {};
  if (req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.iLike]: `%${req.query.search}%`,
        },
      },
      {
        author: {
          [Op.iLike]: `%${req.query.search}%`,
        },
      },
    ];
  }
  try {
    const blogs = await Blog.findAll({
      attributes: { exclude: ["userId"] },
      include: {
        model: User,
        attributes: ["name"],
      },
      where,
      order: [["likes", "DESC"]],
    });
    res.status(200).json(blogs);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

blogsRouter.get("/:id", blogFinder, async (req, res, next) => {
  try {
    res.json(req.blog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post(
  "/",
  userExtractor,
  sessionExtractor,
  async (req, res, next) => {
    try {
      const blog = await Blog.create({ ...req.body, userId: req.user.id });
      res.status(201).json(blog);
    } catch (error) {
      next(error);
    }
  },
);

blogsRouter.delete(
  "/:id",
  blogFinder,
  userExtractor,
  sessionExtractor,
  async (req, res) => {
    const user = req.user;
    if (req.blog.userId !== user.id) {
      return res.status(401).json({ error: "invalid user" });
    }
    try {
      await req.blog.destroy();
      res.status(204).end();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
);

blogsRouter.put(
  "/:id",
  blogFinder,
  userExtractor,
  sessionExtractor,
  async (req, res, next) => {
    try {
      req.blog.likes = req.body.likes;
      await req.blog.save();
      res.status(200).json(req.blog);
    } catch (error) {
      next(error);
    }
  },
);

module.exports = blogsRouter;
