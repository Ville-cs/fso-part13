const logoutRouter = require("express").Router();
const { userExtractor, sessionExtractor } = require("../util/middleware");

logoutRouter.delete(
  "/",
  userExtractor,
  sessionExtractor,
  async (req, res, next) => {
    try {
      await req.session.destroy();
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  },
);

module.exports = logoutRouter;
