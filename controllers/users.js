const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const { Blog, User, ReadingList } = require("../models");

usersRouter.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
    },
  });
  res.json(users);
});

usersRouter.post("/", async (req, res, next) => {
  const { username, name, password } = req.body;

  if (password.length < 3 || username.length < 3) {
    return res
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
  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ["id", "createdAt", "updatedAt", "passwordHash"] },
    include: [
      {
        model: Blog,
        attributes: { exclude: ["userId", "createdAt", "updatedAt"] },
      },
      {
        model: ReadingList,
        as: "readings",
        attributes: ["read", "id"],
        // through: {
        //   attributes: [],
        // },
      },
    ],
  });
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
    if (!user) {
      return res.status(404).json({ error: "user does not exist" });
    }
    user.username = req.body.username;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
