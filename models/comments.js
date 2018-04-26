const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  body: {
    type: String,
    required: true
  },
  belongs_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "articles",
    required: true
  },
  created_at: {
    type: String,
    default: new Date().toLocaleString()
  },
  votes: {
    type: Number,
    default: 0
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  }
});

module.exports = mongoose.model("comments", CommentSchema);
