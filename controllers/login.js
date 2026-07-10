const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const { SECRET } = require("../util/config");
const { User, Session } = require("../models");

loginRouter.post("/", async (req, res, next) => {
  const body = req.body;

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  });
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }
  if (user.disabled === true) {
    return res.status(401).json({
      error: "your account has been disabled",
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);

  try {
    await Session.create({
      token: token,
      userId: user.id,
    });
    res.status(200).send({ token, username: user.username, name: user.name });
  } catch (error) {
    next(error);
  }
});

module.exports = loginRouter;
