require("dotenv").config();

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,
  SECRET: process.env.SECRET,
  PORT: process.env.PORT || 3001,
};
