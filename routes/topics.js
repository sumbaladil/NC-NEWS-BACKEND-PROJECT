const express = require("express");
const router = express.Router();
const {
  getAllTopics,
  getTopicById,
  getArticleForCertainTopic,
  postArticleForCertainTopic
} = require("../controllers");

router.get("/", getAllTopics);
router.get("/:topic", getTopicById);
router.get("/:topic/articles", getArticleForCertainTopic);
router.post("/:topic_id/articles", postArticleForCertainTopic);
module.exports = router;
