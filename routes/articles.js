const express = require("express");
const router = express.Router();
const {
  getAllArticles,
  getAllCommentsForAnArticle,
  getAnIndiviualArticle,
  postCommentForAnArticle,
  updateVoteCount
} = require("../controllers");

router.get("/", getAllArticles);
router.get("/:article_id", getAnIndiviualArticle);
router.get("/:article_id/comments", getAllCommentsForAnArticle);
router.post("/:article_id/comments", postCommentForAnArticle);

router.put("/:article_id", updateVoteCount);
module.exports = router;
