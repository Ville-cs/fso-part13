const blogsRouter = require("express").Router();
const { Blog, User, Session } = require("../models");
const { blogFinder, userExtractor } = require("../util/middleware");
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

blogsRouter.get("/:id", blogFinder, async (req, res) => {
  res.json(req.blog);
});

blogsRouter.post("/", userExtractor, async (req, res, next) => {
  try {
    const user = req.user;
    const session = await Session.findOne({
      where: {
        token: req.token,
      },
    });
    if (user.disabled === true) {
      return res.status(401).json({ error: "your account has been disabled" });
    } else if (!session) {
      return res.status(401).json({ error: "you need to login first" });
    }
    const blog = await Blog.create({ ...req.body, userId: user.id });
    res.status(201).json(blog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:id", blogFinder, userExtractor, async (req, res) => {
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
});

blogsRouter.put("/:id", blogFinder, async (req, res, next) => {
  try {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.status(200).json(req.blog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
