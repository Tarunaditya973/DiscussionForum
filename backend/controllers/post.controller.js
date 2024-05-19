const { Post, Comment } = require("../models/post.model");
const Thread = require("../models/thread.model");
const User = require("../models/user.model");
const createPost = async (req, res) => {
  try {
    const userId = req.user.user._id;
    const { content, threadId } = req.body;
    console.log(req.body);
    const newPost = new Post({
      content: content,
      author: userId,
      thread: threadId,
    });
    const savedPost = await newPost.save();
    res
      .status(201)
      .json({ message: "Post added successfully", post: savedPost });
  } catch (err) {
    console.error("Error creating post:", err);
    return res.status(500).json({ message: "Failed to add post" });
  }
};

const deletePost = async (req, res) => {
  try {
    const { postid } = req.query;
    const userid = req.user.user._id;
    if (!postid) {
      return res.status(400).json({ error: "Missing post ID" });
    }

    const post = await Post.findById(postid);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const thread = await Thread.findOne({ posts: postid });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    if (!thread.owner.equals(userid)) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this post" });
    }
    thread.posts.pull(postid);
    await thread.save();

    await Post.findByIdAndDelete(postid);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const commentOnPost = async (req, res) => {
  try {
    const { content, postId } = req.body;
    const author = req.user.user._id;

    if (!postId || !content || !author) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const comment = new Comment({
      content,
      author,
    });

    await comment.save();

    post.comments.push(comment);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error("err", err);
    res.status(500).json({ error: "Server error" });
  }
};

const replyComment = async (req, res) => {
  try {
    const { content, authorId, commentId, postId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const parentCommentIndex = post.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );
    if (parentCommentIndex === -1) {
      return res.status(404).json({ error: "Parent comment not found" });
    }

    const newReply = new Comment({
      content,
      author: authorId,
      createdAt: Date.now(),
    });

    post.comments[parentCommentIndex].replies.push(newReply);

    await post.save();

    res.status(201).json({ message: "Nested comment added successfully" });
  } catch (error) {
    console.error("Error replying to comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllauthors = async (req, res) => {
  try {
    const authors = await User.find();
    res.status(200).json(authors);
  } catch (err) {
    console.error("Error fetching authors:", err);
    res.status(500).json({ error: "An error occurred while fetching authors" });
  }
};

const fetchPosts = async (req, res) => {
  try {
    const { threadId } = req.query;

    const posts = await Post.find({ thread: threadId })
      .populate("author", "username")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "username",
        },
      })
      .populate({
        path: "comments.replies",
        populate: {
          path: "author",
          select: "username",
        },
      });

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "An error occurred while fetching posts" });
  }
};

module.exports = {
  createPost,
  commentOnPost,
  deletePost,
  fetchPosts,
  getAllauthors,
  replyComment,
};
