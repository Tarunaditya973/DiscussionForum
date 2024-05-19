import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  getPostsRoute,
  getAuthorsRoute,
  createCommentRoute,
  createPostRoute,
  replyCommentRoute,
} from "../utils/ApiRoutes";
import "../css/PostPage.css";

export default function PostPage() {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [authors, setAuthors] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const threadId = location.state?.threadId;
  const [selectedAuthorId, setSelectedAuthorId] = useState("");
  const [showReplyForm, setShowReplyForm] = useState({});
  const [replyText, setReplyText] = useState({});
  const [isReplying, setIsReplying] = useState({});

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleToggleReplyForm = (commentId) => {
    setShowReplyForm((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const handleReplyTextChange = (commentId, value) => {
    setReplyText((prev) => ({ ...prev, [commentId]: value }));
  };

  const handleCreateReply = async (commentId) => {
    try {
      const response = await axios.post(
        replyCommentRoute,
        {
          content: replyText[commentId],
          commentId: commentId,
        },
        { withCredentials: true }
      );
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      fetchPosts();
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const [formData, setFormData] = useState({
    content: "",
    threadId: threadId,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(createPostRoute, formData, {
        withCredentials: true,
      });
      fetchPosts();
    } catch (err) {
      console.log("Error adding Posts: ", err);
    }
  };

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  useEffect(() => {
    fetchPosts();
    fetchAuthors();
  }, []);

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

  const handleReplyClick = (commentId) => {
    // Set the state to indicate that the reply form for this comment should be visible
    setShowReplyForm((prevShowReplyForm) => ({
      ...prevShowReplyForm,
      [commentId]: true,
    }));
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

  const fetchPosts = async () => {
    try {
      const response = await axios.get(getPostsRoute(threadId), {
        withCredentials: true,
      });

      setPosts(response.data);
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleCancelCreateThread = () => {
    setIsFormVisible(false);
  };

  const filterPosts = () => {
    let filtered = posts;
    if (selectedAuthor) {
      filtered = filtered.filter(
        (post) => post.author.username === selectedAuthor
      );
    }
    return sortPosts(filtered);
  };

  const sortPosts = (posts) => {
    switch (sortOrder) {
      case "title":
        return posts.sort((a, b) => a.title.localeCompare(b.title));
      case "date-asc":
        return posts.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      case "date-desc":
        return posts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      default:
        return posts;
    }
  };

  const filteredPosts = filterPosts();

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
      <div className="mb-3">
        <label htmlFor="sortOrderDropdown" className="form-label">
          Sort by:
        </label>
        <select
          id="sortOrderDropdown"
          className="form-select"
          value={sortOrder}
          onChange={handleSortOrderChange}
        >
          <option value="">Default</option>
          <option value="title">Title</option>
          <option value="date-asc">Date (Ascending)</option>
          <option value="date-desc">Date (Descending)</option>
        </select>
      </div>
      <button
        className="btn btn-primary mb-3"
        onClick={handleToggleFormVisibility}
      >
        {isFormVisible ? "Hide Post Form" : "Show Post Form"}
      </button>
      {isFormVisible && (
        <div className="mb-3 p-3 border rounded">
          <div className="mb-3">
            <label htmlFor="newThreadTitle" className="form-label">
              Content:
            </label>
            <input
              type="text"
              className="form-control"
              id="newThreadTitle"
              value={formData.content}
              onChange={(e) => handleChange("content", e.target.value)}
            />
          </div>

          <button className="btn btn-primary mb-3" onClick={handleSubmit}>
            Save
          </button>
          <button
            className="btn btn-secondary mb-3 ms-2"
            onClick={handleCancelCreateThread}
          >
            Cancel
          </button>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : filteredPosts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        <div>
          <div className="container mb-5 mt-5">
            <div className="card">
              <div className="row">
                <div className="col-md-12">
                  <h3 className="text-center mb-5">Posts</h3>
                  {filteredPosts.map((post, index) => (
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
                                  <button
                                    onClick={() => handleReplyClick(post._id)}
                                  >
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                            <p>{post.content}</p>
                            {post.comments.map((comment) => (
                              <div className="media mt-3" key={comment.id}>
                                <div className="media-body">
                                  <div className="row">
                                    <div className="col-12 d-flex">
                                      <h5>{comment.author}</h5>
                                    </div>
                                  </div>
                                  <p>{comment.content}</p>
                                  <button
                                    onClick={() =>
                                      handleToggleReplyForm(comment.id)
                                    }
                                  >
                                    Reply
                                  </button>
                                  {showReplyForm[comment.id] && (
                                    <div>
                                      <textarea
                                        value={replyText[comment.id] || ""}
                                        onChange={(e) =>
                                          handleReplyTextChange(
                                            comment.id,
                                            e.target.value
                                          )
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
