const Blog = require("../models/blog");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  if (!req.blog) {
    return res.status(404).end();
  }
  next();
};

const unknownEndpoint = (_req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, _req, res, next) => {
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "SequelizeValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "SequelizeDatabaseError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === " UniqueConstraintError") {
    return res.status(400).json({ error: error.message });
  } else {
    console.log(error);

    return res.status(400).json({ error: "unknown error" });
  }

  //   next(error);
};

module.exports = {
  blogFinder,
  unknownEndpoint,
  errorHandler,
};
