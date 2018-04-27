const express = require("express");
const router = express.Router();
const {
  getAllComments,
  updateCommentVote,
  deleteCommentById,
  getCommentById
} = require("../controllers");

router.get("/", getAllComments);
router.get("/:comment_id", getCommentById);
router.put("/:comment_id", updateCommentVote);
router.delete("/:comment_id", deleteCommentById);

module.exports = router;
