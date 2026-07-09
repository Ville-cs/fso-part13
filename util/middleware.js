const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const tokenExtractor = (req, _res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    req.token = authorization.replace("Bearer ", "");
  }
  next();
};

const userExtractor = async (req, res, next) => {
  if (!req.token) return res.status(401).json({ error: "token missing" });
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: "token invalid" });
  }
  req.user = await User.findByPk(decodedToken.id);
  next();
};

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
  if (error.name === "SequelizeValidationError") {
    if (error.errors[0].validatorName === "isEmail") {
      return res
        .status(400)
        .json({ error: "username must be a valid email address" });
    } else if (error.errors[0].path === "year") {
      return res
        .status(400)
        .json({ error: "year must be between 1991 and current year" });
    } else if (error.errors[0].message.includes("cannot be null")) {
      return res
        .status(400)
        .json({ error: `column ${error.errors[0].path} cannot be null` });
    }
    return res.status(400).json({ error: error });
  } else if (error.name === "SequelizeDatabaseError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "UniqueConstraintError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({ error: error.errors[0].message });
  } else {
    console.log(error);

    return res.status(400).json({ error: "unknown error" });
  }

  //   next(error);
};

module.exports = {
  tokenExtractor,
  userExtractor,
  blogFinder,
  unknownEndpoint,
  errorHandler,
};
