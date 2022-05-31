const { Sequelize, DataTypes } = require("sequelize");
// const sequelize = require("../config/database");
const sequelize = new Sequelize("sqlite::memory:");

const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  },
  {}
);

module.exports = User;
