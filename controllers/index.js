const { Users, Articles, Comments, Topics } = require("../models");
const { generateArticle } = require("../utils");

exports.getAllTopics = (req, res, next) => {
  return Topics.find()
    .then(topics => {
      res.send({ topics });
    })
    .catch(err => next({ error: 404, message: "Topics not found" }));
};

exports.getTopicById = (req, res, next) => {
  return Topics.find({ _id: `${req.params.topic}` })
    .then(topics => {
      res.send({ topics });
    })
    .catch(err => {
      next({ error: 404, message: "Topic does not exist" });
    });
};

exports.getArticleForCertainTopic = (req, res, next) => {
  return Articles.find({ belongs_to: req.params.topic })
    .populate("belongs_to", "slug")
    .populate("created_by", "name")
    .then(articles => {
      res.send({ articles });
    })
    .catch(err => next({ error: 404, message: "Article does not exist" }));
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
    .catch(err => next({ error: 404, message: "Article does not exist" }));
};
exports.getAllCommentsForAnArticle = (req, res, next) => {
  return Comments.find({ belongs_to: req.params.article_id })
    .populate("belongs_to", "title")
    .then(comments => {
      res.send({ comments });
    })
    .catch(err => next({ error: 404, message: "Comments does not exists" }));
};

exports.getAllArticles = (req, res, next) => {
  return Articles.find()
    .populate("belongs_to", "slug")
    .populate("created_by", "name")
    .then(articles => {
      res.send({ articles });
    })
    .catch(err => next({ error: 404, message: "Article does not exist" }));
};

exports.getAllComments = (req, res, next) => {
  return Comments.find()
    .populate("created_by", "name")
    .populate("belongs_to", "title")
    .then(comments => {
      res.send({ comments });
    })
    .catch(err => next({ error: 404, message: "Comments does not exists" }));
};

exports.getAllUsers = (req, res, next) => {
  return Users.find()
    .then(users => {
      res.send({ users });
    })
    .catch(err => next({ error: 404, message: "No user exists" }));
};

exports.getAnIndiviualArticle = (req, res, next) => {
  console.log(req.params.article_id);
  return Articles.find({ _id: req.params.article_id })
    .populate("belongs_to", "slug ")
    .populate("created_by", "username")
    .then(article => {
      res.send({ article });
    })
    .catch(err => next({ error: 404, message: "Article does not exist" }));
};

exports.postCommentForAnArticle = (req, res, next) => {
  console.log(req.params.article_id);
  console.log(req.body.created_by);
  return Comments.create({
    body: req.body.body,
    belongs_to: req.params.article_id,
    created_by: req.body.created_by,
    votes: 0,
    created_at: new Date().toLocaleString()
  })
    .then(comment => {
      console.log(comment);
      return Promise.all([
        Articles.findOneAndUpdate(
          { _id: comment.belongs_to },
          { $inc: { comments: 1 } },
          { new: true }
        ),
        comment
      ]);
    })
    .then(([result, comment]) => {
      res.status(201).send({ comment });
    })
    .catch(err => {
      console.log("I am in catch");
      next({ error: 404, message: "Invalid userId/ articleId" });
    });
};

exports.updateArticleVoteCount = (req, res, next) => {
  if (req.query.vote === "up") {
    return Articles.findOneAndUpdate(
      { _id: req.params.article_id },
      { $inc: { votes: 1 } },
      { new: true }
    )
      .then(article => {
        res.status(201).send({ article });
      })
      .catch(err => next(err));
  } else if (req.query.vote === "down") {
    return Articles.findOneAndUpdate(
      { _id: req.params.article_id },
      { $inc: { votes: -1 } },
      { new: true }
    )
      .then(article => {
        res.status(201).send({ article });
      })
      .catch(err => next({ error: 404, message: "route not found" }));
  } else next({ status: 404, message: "Route not found" });
};

exports.updateCommentVote = (req, res, next) => {
  if (req.query.vote === "up") {
    return Comments.findOneAndUpdate(
      { _id: req.params.comment_id },
      { $inc: { votes: 1 } },
      { new: true }
    )
      .populate("created_by", "name")
      .populate("belongs_to", "title")

      .then(comment => {
        res.status(201).send({ comment });
      })
      .catch(err => next({ error: 404, message: "route not found" }));
  } else if (req.query.vote === "down") {
    return Comments.findOneAndUpdate(
      { _id: req.params.comment_id },
      { $inc: { votes: -1 } },
      { new: true }
    )
      .populate("created_by", "name")
      .populate("belongs_to", "title")
      .then(comment => {
        res.status(201).send({ comment });
      })
      .catch(err => next({ error: 404, message: "route not found" }));
  } else next({ status: 404, message: "Route not found" });
};

exports.deleteCommentById = (req, res, next) => {
  return Comments.findByIdAndRemove({ _id: req.params.comment_id })
    .then(comment => {
      return Promise.all([
        Articles.findOneAndUpdate(
          { _id: comment.belongs_to },
          { $inc: { comments: -1 } },
          { new: true }
        ),
        comment
      ]);
    })

    .then(([article, comment]) => {
      res.send({ comment });
    })
    .catch(err => next({ status: 404, message: `Comment does not exist` }));
};

exports.getUserById = (req, res, next) => {
  return Users.findById({ _id: req.params.username })
    .then(user => {
      res.send({ user });
    })
    .catch(err => {
      next({ error: 404, message: "User id is invalid" });
    });
};

exports.getCommentById = (req, res, next) => {
  return Comments.findById({ _id: req.params.comment_id })
    .then(comment => {
      if (comment === null)
        next({ error: 404, message: "Comment does not exist" });
      else res.send({ comment });
    })
    .catch(err => {
      next({ error: 404, message: "Comment id is invalid" });
    });
};
