const blogsRouter = require("express").Router();
const { Blog, User } = require("../models");
const { blogFinder, userExtractor } = require("../util/middleware");

blogsRouter.get("/", async (_req, res) => {
  try {
    const blogs = await Blog.findAll({
      include: {
        model: User,
      },
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
  const user = req.user;
  try {
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
