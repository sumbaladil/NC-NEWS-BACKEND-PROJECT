const mongoose = require("mongoose");
const { Users, Articles, Comments, Topics } = require("../models");
const {
  createIdReferenceObject,
  formatArticlesData,
  formatCommentsData,
  formatCommentsDataTest
} = require("../utils");

function seedDB(topicsData, userData, articlesData) {
  let users;
  
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useUnifiedTopology', true);
  
  return mongoose.connection
    .dropDatabase()
    .then(() => {
      console.log(`The ${process.env.NODE_ENV} database dropped`);
      return Promise.all([
        Users.insertMany(userData),
        Topics.insertMany(topicsData)
      ]);
    })
    .then(([userDocs, topicDocs]) => {
      users = userDocs;
      const topicIds = createIdReferenceObject(topicsData, topicDocs);
      const userIds = createIdReferenceObject(userData, userDocs);
      const formattedArticles = formatArticlesData(
        articlesData,
        topicIds,
        userIds
      );
      return Promise.all([
        Articles.insertMany(formattedArticles),
        topicDocs,
        userDocs,
        userIds
      ]);
    })
    .then(([articleDocs, topicDocs, userDocs, userIds]) => {
      const articleIds = createIdReferenceObject(articlesData, articleDocs);
      //if its dev environment call formatCommentsData

      let formattedComments;
      if (
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "production"
      ) {
        formattedComments = formatCommentsData(
          articleDocs,
          userIds,
          articleIds
        );
      } else if (process.env.NODE_ENV === "test") {
        formattedComments = formatCommentsDataTest(
          articleDocs,
          userIds,
          articleIds
        );
      }
      return Promise.all([
        articleDocs,
        topicDocs,
        userDocs,
        Comments.insertMany(formattedComments)
      ]);
    })
    .catch(err => {
      console.log(`Error: ${err}`);
    });
}
module.exports = seedDB;
