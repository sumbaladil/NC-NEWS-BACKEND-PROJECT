const { DB } = require("../config");
const seedDB = require("./seed");
const mongoose = require("mongoose");
const topicsData = require("./devData/topics");
const usersData = require("./devData/users");
const articlesData = require("./devData/articles");

mongoose
  .connect(DB)
  .then(() => seedDB(topicsData, usersData, articlesData))
  .then(() => {
    console.log("disconnected now");
    mongoose.disconnect();
  });
