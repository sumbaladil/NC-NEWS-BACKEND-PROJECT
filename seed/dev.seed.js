const { DB } = require("../config");
const seedDB = require("./seed");
const mongoose = require("mongoose");
const topicsData = require("./devData/topics");
const usersData = require("./devData/users");
const articlesData = require("./devData/articles");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose
  .connect(DB)
  .then(() => seedDB(topicsData, usersData, articlesData))
  .then(() => {
    console.log("disconnected now");
    mongoose.disconnect();
  })
  .catch(err => {
    console.log(`Couldn't connect to database`);
  });
