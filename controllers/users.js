const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const { User } = require("../models");

usersRouter.get("/", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (password.length < 3 || username.length < 3) {
    return response
      .status(400)
      .json({
        error: "username and password must be at least 3 characters long",
      })
      .end();
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = User.build({
    username,
    name,
    passwordHash,
  });
  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

usersRouter.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

usersRouter.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    await user.destroy();
    res.status(200).end();
  } catch (error) {
    return res.status(400).json({ error });
  }
});

usersRouter.put("/:username", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.params.username,
      },
    });
    user.username = req.body.username;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
