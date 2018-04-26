process.env.NODE_ENV = "test";
const DB_URL = require("../config");
const { expect } = require("chai");
const app = require("../app"); // this will also connect to right db
const request = require("supertest")(app);
const mongoose = require("mongoose");
const seedDB = require("../seed/seed");
const topicsData = require("../seed/testData/topics");
const usersData = require("../seed/testData/users");
const articlesData = require("../seed/testData/articles");
let seedArticles, seedTopics, seedUsers, seedComments;

describe("/", () => {
  beforeEach(() => {
    return seedDB(topicsData, usersData, articlesData).then(seededData => {
      [seedArticles, seedTopics, seedUsers, seedComments] = seededData;
    });
  });
  after(() => {
    return mongoose.disconnect().then(() => {
      console.log(`disconnected from ${DB_URL}`);
    });
  });

  describe("api/topics", () => {
    it("Gets the json object from all the topics", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys("topics");
          expect(res.body.topics[0]).has.ownProperty("title");
          expect(res.body.topics[0].title).to.equal("Mitch");
          expect(res.body.topics[0]).has.ownProperty("slug");
          expect(res.body.topics[0].slug).to.equal("mitch");
          expect(res.body.topics.length).to.equal(2);
        });
    });
  });

  describe("api/topics/:topic_id/articles", () => {
    it("Post an article on a certain topic", () => {
      const newArticle = {
        votes: 0,
        title: "Rainbow",
        body: "I am a rainbow",
        created_by: seedUsers[0]._id
      };
      return request
        .post(`/api/topics/${seedTopics[0]._id}/articles`) // topic id for mitch
        .send(newArticle)
        .expect(201)
        .then(res => {
          expect(res.body).to.have.all.keys("article");
          expect(res.body.article).has.ownProperty("title");
          expect(res.body.article.title).to.equal(newArticle.title);
          expect(res.body.article).has.ownProperty("votes");
          expect(res.body.article.votes).to.equal(newArticle.votes);
          expect(res.body.article).has.ownProperty("body");
          expect(res.body.article.body).to.equal(newArticle.body);
          expect(res.body.article).has.ownProperty("belongs_to");
          expect(res.body.article.belongs_to).to.equal(`${seedTopics[0]._id}`);
          expect(res.body.article).has.ownProperty("created_by");

          expect(res.body.article.created_by).to.equal(`${seedUsers[0]._id}`);
        });
    });
  });
  describe("api/topics/:topic/articles", () => {
    it("Gets all articles for a topic", () => {
      return request
        .get(`/api/topics/${seedTopics[0]._id}/articles`)
        .expect(200)
        .then(res => {
          console.log(`/api/topics/${seedArticles[0]._id}/articles`);
          console.log(res.body);
          expect(res.body).to.have.all.keys("articles");
          expect(res.body.articles[0]).has.ownProperty("belongs_to");
          expect(res.body.articles[0].belongs_to._id).to.equal(
            String(seedTopics[0]._id)
          );
          expect(res.body.articles[0].belongs_to.slug).to.equal("mitch");
          expect(res.body.articles[0]).has.ownProperty("votes");
          expect(res.body.articles[0]).has.ownProperty("title");
          expect(res.body.articles[0].title).to.equal(
            "Living in the shadow of a great man"
          );
          expect(res.body.articles[0]).has.ownProperty("body");
          expect(res.body.articles[0].body).to.equal(
            "I find this existence challenging"
          );
          expect(res.body.articles[0]).has.ownProperty("created_by");
          expect(res.body.articles[0].created_by).to.be.equal(
            String(seedUsers[0]._id)
          );
        });
    });
  });

  describe("api/articles", () => {
    it("Gets the json object from all the articles", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys("articles");
          expect(res.body.articles[3]).has.ownProperty("title");
          expect(res.body.articles[3].title).to.be.equal(
            "UNCOVERED: catspiracy to bring down democracy"
          );
          expect(res.body.articles[3]).has.ownProperty("body");
          expect(res.body.articles[3].body).to.equal(
            "Bastet walks amongst us, and the cats are taking arms!"
          );
          expect(res.body.articles[3]).has.ownProperty("belongs_to");
          expect(res.body.articles[3].belongs_to._id).to.equal(
            String(seedTopics[1]._id)
          );
          expect(res.body.articles[3]).has.ownProperty("created_by");
          expect(res.body.articles[3].created_by._id).to.equal(
            String(seedUsers[0]._id)
          );
          expect(res.body.articles.length).to.equal(4);
        });
    });
  });

  describe("api/articles:article_id", () => {
    it("Gets the specific article", () => {
      return request
        .get(`/api/articles/${seedArticles[0]._id}`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys("article");
          expect(res.body.article[0]).has.ownProperty("_id");
          expect(res.body.article[0]._id).to.equal(`${seedArticles[0]._id}`);
          expect(res.body.article[0]).has.ownProperty("title");
          expect(res.body.article[0].title).to.equal(
            "Living in the shadow of a great man"
          );
          expect(res.body.article[0]).has.ownProperty("votes");

          expect(res.body.article[0]).has.ownProperty("body");
          expect(res.body.article[0].body).to.equal(
            "I find this existence challenging"
          );

          expect(res.body.article[0]).has.ownProperty("belongs_to");
          expect(res.body.article[0].belongs_to._id).to.equal(
            `${seedTopics[0]._id}`
          );

          expect(res.body.article[0]).has.ownProperty("created_by");
          expect(res.body.article[0].created_by._id).to.equal(
            String(seedUsers[0]._id)
          );
        });
    });
  });

  ////GET /api/articles/:article_id/comments
  //Get all the comments for a individual article
  describe("api/articles:article_id/comments", () => {
    it("Gets the comments for an individual article", () => {
      return request
        .get(`/api/articles/${seedArticles[0]._id}/comments`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys("comments");
          expect(res.body.comments[0]).has.ownProperty("created_at");
          expect(res.body.comments[0]).has.ownProperty("votes");
          expect(res.body.comments[0]).has.ownProperty("_id");
          expect(res.body.comments[0]).has.ownProperty("body");
          expect(res.body.comments[0]).has.ownProperty("belongs_to");
          expect(res.body.comments[0].belongs_to._id).to.equal(
            `${seedArticles[0]._id}`
          );
          expect(res.body.comments[0]).has.ownProperty("created_by");
          expect(res.body.comments[0].created_by).to.equal(
            String(seedUsers[0]._id)
          );
        });
    });
  });

  describe.only("api/articles:article_id/comments", () => {
    it("Post the comments for a certain article", () => {
      const newComment = {
        body: "Jonny like all types cats including snooty ones",
        created_by: seedUsers[0]._id // jonny
      };
      return request
        .post(`/api/articles/${seedArticles[1]._id}/comments`) /// article's topic is cats
        .send(newComment)
        .expect(201)
        .then(res => {
          expect(res.body).to.have.all.keys("comment");
          expect(res.body.comment).has.ownProperty("created_at");
          expect(res.body.comment).has.ownProperty("votes");
          expect(res.body.comment).has.ownProperty("_id");
          expect(res.body.comment).has.ownProperty("body");
          expect(res.body.comment).has.ownProperty("belongs_to");
          expect(res.body.comment.belongs_to).to.equal(
            `${seedArticles[1]._id}`
          );
          expect(res.body.comment).has.ownProperty("created_by");
          expect(res.body.comment.created_by).to.equal(
            String(seedUsers[0]._id)
          );
        });
    });
  });

  describe("api/users", () => {
    it("Gets the json object from all the users", () => {
      return request
        .get("/api/users")
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys("users");
          expect(res.body.users[0]).has.ownProperty("username");
          expect(res.body.users[0].username).to.equal("butter_bridge");
          expect(res.body.users[0]).has.ownProperty("name");
          expect(res.body.users[0].name).to.equal("jonny");
          expect(res.body.users[0]).has.ownProperty("avatar_url");
          expect(res.body.users[0].avatar_url).to.equal(
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
          );
          expect(res.body.users.length).to.equal(2);
        });
    });
  });

  describe("api/comments", () => {
    it("Gets the json object from all the commnents", () => {
      return request
        .get("/api/comments")
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys("comments");
          expect(res.body.comments.length).to.equal(4); // one comment for each 4 articles
        });
    });
  });
});
