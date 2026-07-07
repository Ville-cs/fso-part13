const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const { blogFinder, userExtractor } = require("../util/middleware");

blogsRouter.get("/", async (_req, res) => {
  try {
    const blogs = await Blog.findAll();
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

blogsRouter.delete("/:id", blogFinder, async (req, res) => {
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
