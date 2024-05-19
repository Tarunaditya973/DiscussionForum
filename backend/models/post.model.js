const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  replies: [this],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Media schema
const MediaSchema = new Schema({
  type: {
    type: String,
    enum: ["image", "video", "link"],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

// Post schema
const PostSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  thread: {
    type: Schema.Types.ObjectId,
    ref: "Thread",
    required: true,
  },
  media: [MediaSchema], // Array of media objects
  comments: [CommentSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", PostSchema);
const Comment = mongoose.model("Comment", CommentSchema);
module.exports = {
  Post,
  Comment,
};
