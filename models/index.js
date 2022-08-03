const Sequelize = require('sequelize');

const User = require('./user');
const Memo = require('./memo');

const env = process.env.NODE_ENV || 'development';
const config= require(__dirname + '/../config/config.js')[env]
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Memo = Memo;
db.User = User;

Memo.init(sequelize);
User.init(sequelize);

User.associate(db);
Memo.associate(db);

module.exports = db;