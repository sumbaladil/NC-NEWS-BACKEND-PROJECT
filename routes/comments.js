const express = require("express");
const router = express.Router();
const {
  getAllComments,
  updateCommentVote,
  deleteCommentById
} = require("../controllers");

router.get("/", getAllComments);

router.put("/:comment_id", updateCommentVote);

router.delete("/:comment_id", deleteCommentById);
module.exports = router;
