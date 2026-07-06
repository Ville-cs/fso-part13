const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (_req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.status(200).json(blogs);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

blogsRouter.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    res.status(200).json(blog);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

blogsRouter.post("/", async (req, res) => {
  try {
    const blog = await Blog.create({ ...req.body });
    res.status(201).json(blog);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

blogsRouter.delete("/:id", async (req, res) => {
  try {
    const deleted = await Blog.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (deleted === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(204).end();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// blogsRouter.put('/:id', async (req, res) => {
//   const body = req.body
//   const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, body, {
//     new: true,
//   })
//   res.status(200).json(updatedBlog)
// })

module.exports = blogsRouter;
