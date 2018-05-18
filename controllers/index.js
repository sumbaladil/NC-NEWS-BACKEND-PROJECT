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
    .then(articles => {
      Articles.find({ _id: `${articles._id}` })
        .populate("belongs_to")
        .populate("created_by")
        .then(articles => {
          res.status(201).send({ articles });
        });
    })
    .catch(err => next({ error: 404, message: "Article does not exist" }));
};
exports.getAllCommentsForAnArticle = (req, res, next) => {
  return Comments.find({ belongs_to: req.params.article_id })
    .populate("belongs_to", "title")
    .populate("created_by")
    .then(comments => {
      res.send({ comments });
    })
    .catch(err => next({ error: 404, message: "Comments does not exists" }));
};

exports.getAllArticles = (req, res, next) => {
  return Articles.find()
    .populate("belongs_to", "slug")
    .populate("created_by")
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
  return Articles.find({ _id: req.params.article_id })
    .populate("belongs_to", "slug ")
    .populate("created_by", "username")
    .then(articles => {
      res.send({ articles });
    })
    .catch(err => next({ error: 404, message: "Article does not exist" }));
};

exports.postCommentForAnArticle = (req, res, next) => {
  console.log(req.body);
  return Comments.create({
    body: req.body.body,
    belongs_to: req.params.article_id,
    created_by: req.body.created_by,
    votes: 0,
    created_at: new Date().toLocaleString()
  })
    .then(comments => {
      console.log(comments);
      return Promise.all([
        Articles.findOneAndUpdate(
          { _id: comments.belongs_to },
          { $inc: { comments: 1 } },
          { new: true }
        ),
        comments
      ]);
    })
    .then(([result, comments]) => {
      res.status(201).send({ comments });
    })
    .catch(err => {
      next({ error: 404, message: "***Invalid userId/ articleId" });
    });
};

exports.updateArticleVoteCount = (req, res, next) => {
  if (req.query.vote === "up") {
    return Articles.findOneAndUpdate(
      { _id: req.params.article_id },
      { $inc: { votes: 1 } },
      { new: true }
    )
      .then(articles => {
        res.status(201).send({ articles });
      })
      .catch(err => next(err));
  } else if (req.query.vote === "down") {
    return Articles.findOneAndUpdate(
      { _id: req.params.article_id },
      { $inc: { votes: -1 } },
      { new: true }
    )
      .then(articles => {
        res.status(201).send({ articles });
      })
      .catch(err => next({ error: 404, message: "route not found" }));
  } else next({ status: 400, message: "bad request" });
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

      .then(comments => {
        res.status(201).send({ comments });
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
      .then(comments => {
        res.status(201).send({ comments });
      })
      .catch(err => next({ error: 404, message: "route not found" }));
  } else next({ status: 400, message: "bad request" });
};

exports.deleteCommentById = (req, res, next) => {
  return Comments.findByIdAndRemove({ _id: req.params.comment_id })
    .then(comments => {
      return Promise.all([
        Articles.findOneAndUpdate(
          { _id: comments.belongs_to },
          { $inc: { comments: -1 } },
          { new: true }
        ),
        comments
      ]);
    })

    .then(([article, comments]) => {
      res.send({ comments });
    })
    .catch(err => next({ status: 404, message: `Comment does not exist` }));
};

exports.getUserById = (req, res, next) => {
  return Users.findById({ _id: req.params.username })
    .then(users => {
      res.send({ users });
    })
    .catch(err => {
      next({ error: 404, message: "User id is invalid" });
    });
};

exports.getCommentById = (req, res, next) => {
  return Comments.findById({ _id: req.params.comment_id })
    .then(comments => {
      if (comments === null)
        next({ error: 404, message: "Comment does not exist" });
      else res.send({ comments });
    })
    .catch(err => {
      next({ error: 404, message: "Comment id is invalid" });
    });
};
