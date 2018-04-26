const express = require("express");
const router = express.Router();
const {
  getAllTopics,
  getTopicBySlug,
  getArticleForCertainTopic,
  postArticleForCertainTopic
} = require("../controllers");

router.get("/", getAllTopics);
router.get("/:topic", getTopicBySlug);
router.get("/:topic/articles", getArticleForCertainTopic);
router.post("/:topic_id/articles", postArticleForCertainTopic);
module.exports = router;
