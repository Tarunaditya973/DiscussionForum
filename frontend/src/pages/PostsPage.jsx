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
import PostItem from "../components/PostItem";
import "../css/PostPage.css";
import { useNavigate } from "react-router-dom";

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
  const [replyTextForPost, setReplyTextForPost] = useState({});
  const [isReplying, setIsReplying] = useState({});
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleToggleReplyForm = (commentId) => {
    setShowReplyForm((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleReplyClick = (postId) => {
    setIsReplying((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const [formData, setFormData] = useState({
    content: "",
    threadId: threadId,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(createPostRoute, formData, {
        withCredentials: true,
      });
      fetchPosts();
    } catch (err) {
      console.log("Error adding Posts: ", err);
    }
  };

  const handleCreateReply = async (commentId, postId) => {
    try {
      await axios.post(
        replyCommentRoute,
        {
          content: replyText[commentId],
          commentId: commentId,
          postId: postId,
        },
        { withCredentials: true }
      );
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      fetchPosts();
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const handleReplyForPost = async (postId) => {
    try {
      await axios.post(
        createCommentRoute,
        {
          content: replyTextForPost[postId],
          postId: postId,
        },
        { withCredentials: true }
      );
      setReplyTextForPost((prev) => ({ ...prev, [postId]: "" })); // Resetting the text area after submission
      fetchPosts();
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const handleReplyTextChange = (commentId, text) => {
    setReplyText((prev) => ({
      ...prev,
      [commentId]: text,
    }));
  };

  useEffect(() => {
    fetchPosts();
    fetchAuthors();
    if (!localStorage.getItem("user")) {
      navigate("/login");
    }
    setUser(JSON.parse(localStorage.getItem("user")).username);
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await axios.get(getAuthorsRoute, {
        withCredentials: true,
      });
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
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
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
                  {filteredPosts.map((post) => (
                    <div className="row" key={post._id}>
                      <div className="col-md-12">
                        <div className="media">
                          <div className="media-body">
                            <div className="row">
                              <div className="col-8 d-flex">
                                <h5>{post.author.username}</h5>
                              </div>
                              <div className="col-4">
                                <div className="pull-right reply">
                                  {isReplying[post._id] ? (
                                    <div>
                                      <textarea
                                        placeholder="Type your reply here..."
                                        value={replyTextForPost[post._id] || ""}
                                        onChange={(e) =>
                                          setReplyTextForPost((prev) => ({
                                            ...prev,
                                            [post._id]: e.target.value,
                                          }))
                                        }
                                      ></textarea>
                                      <button
                                        onClick={() =>
                                          handleReplyForPost(post._id)
                                        }
                                      >
                                        Submit
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => handleReplyClick(post._id)}
                                    >
                                      reply
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                            <p>{post.content}</p>

                            {post.comments.map((comment) => (
                              <div
                                className="media mt-3 mb-5 ml-5"
                                key={comment._id}
                              >
                                <div
                                  className="vr"
                                  style={{ height: "35px" }}
                                ></div>
                                <div className="media-body">
                                  <div className="row">
                                    <div className="col-12 d-flex">
                                      <h5>{comment.author.username}</h5>
                                    </div>
                                  </div>
                                  <p>{comment.content}</p>
                                  <button
                                    onClick={() =>
                                      handleToggleReplyForm(comment._id)
                                    }
                                  >
                                    Reply
                                  </button>
                                  {showReplyForm[comment._id] && (
                                    <div>
                                      <textarea
                                        value={replyText[comment._id] || ""}
                                        onChange={(e) =>
                                          handleReplyTextChange(
                                            comment._id,
                                            e.target.value
                                          )
                                        }
                                      />
                                      <button
                                        onClick={() =>
                                          handleCreateReply(
                                            comment._id,
                                            post._id
                                          )
                                        }
                                      >
                                        Submit
                                      </button>
                                    </div>
                                  )}

                                  {comment.replies &&
                                    comment.replies.map((reply) => (
                                      <div
                                        className="media mt-3 mb-5 ml-5"
                                        key={reply._id}
                                        style={{
                                          marginLeft: "20px",
                                        }}
                                      >
                                        <div
                                          className="vr"
                                          style={{
                                            height: "35px",
                                          }}
                                        ></div>

                                        <div className="media-body">
                                          <div className="row">
                                            <div className="col-12 d-flex">
                                              <h5>{user}</h5>
                                            </div>
                                          </div>
                                          <p>{reply.content}</p>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <hr className="hr" />
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
