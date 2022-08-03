
require('dotenv').config();
const env = process.env;

const development = {
  username: env.USER,
  password: env.PASSWORD,
  database: env.DATABASE,
  host: env.HOST,
  dialect: "mysql",
};

const production = {
  username: env.USER,
  password: env.PASSWORD,
  database: env.DATABASE,
  host: env.HOST,
  dialect: "mysql",
};

const test = {
  username: env.USER,
  password: env.PASSWORD,
  database: env.DATABASE,
  host: env.HOST,
  dialect: "mysql",
};

module.exports = { development, production, test };