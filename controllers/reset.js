const resetRouter = require("express").Router();
const { sequelize } = require("../util/db");
const { Blog, User } = require("../models");

resetRouter.post("/", async (_req, res) => {
  try {
    await Blog.truncate({ cascade: true, restartIdentity: true });
    await User.truncate({ cascade: true, restartIdentity: true });
    res.status(200).end();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = resetRouter;
