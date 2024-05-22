const express = require("express");
const router = express.Router();
const {
  createPost,
  commentOnPost,
  fetchPosts,
  getAllauthors,
  replyComment,
  deletePost,
} = require("../controllers/post.controller");
router.post("/create-post", createPost);
router.post("/comment", commentOnPost);
router.get("/get-posts", fetchPosts);
router.get("/allauthors", getAllauthors);
router.post("/reply", replyComment);
router.post("/delete-post", deletePost);
module.exports = router;
