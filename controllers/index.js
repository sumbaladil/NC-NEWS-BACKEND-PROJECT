const { Users, Articles, Comments, Topics } = require("../models");
const { generateArticle } = require("../utils");
exports.getAllTopics = (req, res, next) => {
  return Topics.find()
    .then(topics => {
      res.send({ topics });
    })
    .catch(err => next(err));
};

exports.getTopicBySlug = (req, res, nex) => {
  return Topics.find({ slug: `${req.params.topic}` })
    .then(topics => {
      res.send({ topics });
    })
    .catch(err => next(err));
};

exports.getArticleForCertainTopic = (req, res, nex) => {
  return Articles.find({ belongs_to: req.params.topic })
    .populate("belongs_to", "slug")
    .then(articles => {
      res.send({ articles });
    })
    .catch(err => next(err));
};

exports.postArticleForCertainTopic = (req, res, next) => {
  return Articles.create({
    votes: 0,
    title: req.body.title,
    body: req.body.body,
    belongs_to: req.params.topic_id,
    created_by: req.body.created_by
  })
    .then(article => {
      res.status(201).send({ article });
    })
    .catch(err => next(err));
};
exports.getAllCommentsForAnArticle = (req, res, next) => {
  return Comments.find({ belongs_to: req.params.article_id })
    .populate("belongs_to", "title")
    .then(comments => {
      res.send({ comments });
    })
    .catch(err => next(err));
};

exports.getAllArticles = (req, res, next) => {
  return Articles.find()
    .populate("belongs_to", "slug")
    .populate("created_by", "name")
    .then(articles => {
      res.send({ articles });
    })
    .catch(err => next(err));
};

exports.getAllComments = (req, res, next) => {
  return Comments.find()
    .populate("created_by", "name")
    .populate("belongs_to", "title")
    .then(comments => {
      res.send({ comments });
    })
    .catch(err => next(err));
};

exports.getAllUsers = (req, res, next) => {
  return Users.find()
    .then(users => {
      res.send({ users });
    })
    .catch(err => next(err));
};

exports.getAnIndiviualArticle = (req, res, next) => {
  console.log(req.params.article_id);
  return Articles.find({ _id: req.params.article_id })
    .populate("belongs_to", "slug ")
    .populate("created_by", "username")
    .then(article => {
      res.send({ article });
    })
    .catch(err => next(err));
};

exports.postCommentForAnArticle = (req, res, next) => {
  return Comments.create({
    body: req.body.body,
    belongs_to: req.params.article_id,
    created_by: req.body.created_by,
    votes: 0,
    created_at: new Date().toLocaleString()
  })
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(err => next(err));
};
