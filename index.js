const express = require("express");
const middleware = require("./util/middleware");
const app = express();
const morgan = require("morgan");

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const logoutRouter = require("./controllers/logout");
const authorRouter = require("./controllers/authors");
const readingListRouter = require("./controllers/readingLists");
const resetRouter = require("./controllers/reset");

const { unknownEndpoint, errorHandler } = require("./util/middleware");

app.use(express.json());

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :body ",
  ),
);

app.use(middleware.tokenExtractor);

app.get("/", (_, res) => res.sendStatus(200));
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/authors", authorRouter);
app.use("/api/readingLists", readingListRouter);
app.use("/api/reset", resetRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
