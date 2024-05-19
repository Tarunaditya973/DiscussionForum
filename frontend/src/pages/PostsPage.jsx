import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  getPostsByAuthorRoute,
  getAuthorsRoute,
  createCommentRoute,
  createPostRoute,
} from "../utils/ApiRoutes";
import { useNavigate } from "react-router-dom";
import PostItem from "../components/PostItem";
import "../css/PostPage.css";

export default function PostPage() {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [authors, setAuthors] = useState([]);
  const [newComments, setNewComments] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);
  const threadId = location.state?.threadId;
  const [selectedAuthorId, setSelectedAuthorId] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const handleReplyClick = () => {
    setIsReplying(true);
  };

  const handleToggleReplyForm = (commentId) => {
    setShowReplyForm(commentId);
  };

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    content: "",
    threadId: threadId,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const response = axios.post(createPostRoute, formData, {
        withCredentials: true,
      });
      fetchPosts();
    } catch (err) {
      console.log("Error adding Posts: ", err);
    }
  };

  const handleCreateReply = (commentId) => {
    // Implement logic to create a reply
  };

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleCommentClick = () => {};

  useEffect(() => {
    fetchPosts();
    fetchAuthors();
  }, [selectedAuthor, threadId]);

  const fetchAuthors = async () => {
    try {
      const response = await axios.get(getAuthorsRoute, {
        withCredentials: true,
      });
      // Set authors as an array of usernames
      setAuthors(response.data.map((author) => author.username));
    } catch (error) {
      console.error("Error fetching authors:", error);
    }
  };
  const handleAuthorChange = async (event) => {
    const selectedUsername = event.target.value;
    try {
      const response = await axios.get(getAuthorsRoute, {
        withCredentials: true,
      });
      const selectedAuthor = response.data.find(
        (author) => author.username === selectedUsername
      );
      if (selectedAuthor) {
        setSelectedAuthorId(selectedAuthor.id);
        setSelectedAuthor(selectedUsername);
      }
    } catch (error) {
      console.error("Error fetching authors:", error);
    }
  };

  // Fetch posts using the selected author's ID
  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        getPostsByAuthorRoute(selectedAuthorId, threadId), // Pass selectedAuthorId instead of selectedAuthor
        { withCredentials: true }
      );
      console.log("response", response.data);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewCommentChange = (postId, event) => {
    const { value } = event.target;
    setNewComments((prevComments) => ({
      ...prevComments,
      [postId]: value,
    }));
  };

  const handleCreateComment = async (postId) => {
    try {
      const response = await axios.post(
        createCommentRoute,
        {
          content: newComments[postId],
        },
        {
          params: {
            postId: postId,
          },
          withCredentials: true,
        }
      );
      // Refresh the posts list to display the new comment
      fetchPosts();
      // Clear the new comment input field
      setNewComments((prevComments) => ({
        ...prevComments,
        [postId]: "",
      }));
    } catch (error) {
      console.error("Error creating new comment:", error);
    }
  };

  const handleToggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <div className="container mt-4">
      <h1>Posts</h1>
      <div className="mb-3">
        <label htmlFor="authorDropdown" className="form-label">
          Filter by Author:
        </label>
        <select
          id="authorDropdown"
          className="form-select"
          value={selectedAuthor}
          onChange={handleAuthorChange}
        >
          <option value="">All Authors</option>
          {authors &&
            authors.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
        </select>
      </div>

      <button
        className="btn btn-primary mb-3"
        onClick={handleToggleFormVisibility}
      >
        {isFormVisible ? "Hide Post Form" : "Show Post Form"}
      </button>

      {isFormVisible && (
        <div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="content">Content:</label>
              <textarea
                id="content"
                className="form-control"
                value={formData.content}
                onChange={(e) => handleChange("content", e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        <div>
          <div className="container mb-5 mt-5">
            <div className="card">
              <div className="row">
                <div className="col-md-12">
                  <h3 className="text-center mb-5">Posts</h3>
                  {posts.map((post, index) => (
                    <div className="row" key={index}>
                      <div className="col-md-12">
                        <div className="media">
                          <div className="media-body">
                            <div className="row">
                              <div className="col-8 d-flex">
                                <h5>{post.author.username}</h5>
                              </div>
                              <div className="col-4">
                                <div className="pull-right reply">
                                  {isReplying ? (
                                    <div>
                                      <textarea placeholder="Type your reply here..."></textarea>
                                      <button onClick={handleCommentClick}>
                                        Submit
                                      </button>
                                    </div>
                                  ) : (
                                    <button onClick={handleReplyClick}>
                                      reply
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                            <p>{post.content}</p>
                            {post.comments.map((comment, i) => (
                              <div className="media mt-3" key={i}>
                                <a className="pr-3" href="#">
                                  <img
                                    className="rounded-circle"
                                    alt="Commenter"
                                    src={comment.avatar}
                                  />
                                </a>
                                <div className="media-body">
                                  <div className="row">
                                    <div className="col-12 d-flex">
                                      <h5>{comment.author}</h5>
                                    </div>
                                  </div>
                                  <p>{comment.text}</p>
                                  <button
                                    onClick={() =>
                                      handleToggleReplyForm(comment.id)
                                    }
                                  >
                                    Reply
                                  </button>
                                  {showReplyForm === comment.id && (
                                    <div>
                                      <textarea
                                        value={replyText}
                                        onChange={(e) =>
                                          setReplyText(e.target.value)
                                        }
                                      />
                                      <button
                                        onClick={() =>
                                          handleCreateReply(comment.id)
                                        }
                                      >
                                        Submit
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
