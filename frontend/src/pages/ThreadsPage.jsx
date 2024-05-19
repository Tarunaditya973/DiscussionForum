import { useState, useEffect } from "react";
import axios from "axios";
import {
  getAuthorsRoute,
  getAllThreadsRoute,
  createNewThread,
  logoutRoute,
} from "../utils/ApiRoutes";
import { useNavigate } from "react-router-dom";

export default function ThreadPage() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadDescription, setNewThreadDescription] = useState("");
  const [newThreadCategory, setNewThreadCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("user")) navigate("/login");
    fetchThreads();
    fetchAuthors();
  }, []);

  const fetchThreads = async () => {
    try {
      const response = await axios.get(getAllThreadsRoute, {
        withCredentials: true,
      });
      const uniqueCategories = Array.from(
        new Set(response.data.threads.map((thread) => thread.category))
      );
      setCategories(uniqueCategories);
      setThreads(response.data.threads);
    } catch (error) {
      console.error("Error fetching threads:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleAuthorChange = (event) => {
    setSelectedAuthor(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleNewThreadTitleChange = (event) => {
    setNewThreadTitle(event.target.value);
  };

  const handleNewThreadDescriptionChange = (event) => {
    setNewThreadDescription(event.target.value);
  };

  const handleNewThreadCategoryChange = (event) => {
    setNewThreadCategory(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleToggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleCancelCreateThread = () => {
    setNewThreadTitle("");
    setNewThreadDescription("");
    setNewThreadCategory("");
    setIsFormVisible(false);
  };

  const filterThreads = () => {
    let filtered = threads;
    if (selectedAuthor) {
      filtered = filtered.filter(
        (thread) => thread.owner.username === selectedAuthor
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(
        (thread) => thread.category === selectedCategory
      );
    }
    return sortThreads(filtered);
  };

  const sortThreads = (threads) => {
    switch (sortOrder) {
      case "title":
        return threads.sort((a, b) => a.title.localeCompare(b.title));
      case "date-asc":
        return threads.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      case "date-desc":
        return threads.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      default:
        return threads;
    }
  };

  const handleCreateThread = async () => {
    try {
      await axios.post(
        createNewThread,
        {
          title: newThreadTitle,
          description: newThreadDescription,
          category: newThreadCategory,
        },
        {
          withCredentials: true,
        }
      );
      fetchThreads();
      setNewThreadTitle("");
      setNewThreadDescription("");
      setNewThreadCategory("");
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error creating thread:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    const response = axios.post(logoutRoute);
    navigate("/login");
  };

  const navigateToPosts = (threadId) => {
    navigate("/posts", { state: { threadId } });
  };

  const filteredThreads = filterThreads();

  return (
    <div className="container mt-4">
      <h1>Threads</h1>
      <button
        className="btn btn-danger btn-sm mb-3 float-end"
        onClick={handleLogout}
      >
        Logout
      </button>
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
        <label htmlFor="categoryDropdown" className="form-label">
          Filter by Category:
        </label>
        <select
          id="categoryDropdown"
          className="form-select"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
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

      {!isFormVisible && (
        <button
          className="btn btn-primary mb-3"
          onClick={handleToggleFormVisibility}
        >
          Create Thread
        </button>
      )}

      {isFormVisible && (
        <div className="mb-3 p-3 border rounded">
          <div className="mb-3">
            <label htmlFor="newThreadTitle" className="form-label">
              Title:
            </label>
            <input
              type="text"
              className="form-control"
              id="newThreadTitle"
              value={newThreadTitle}
              onChange={handleNewThreadTitleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="newThreadDescription" className="form-label">
              Description:
            </label>
            <textarea
              className="form-control"
              id="newThreadDescription"
              rows="3"
              value={newThreadDescription}
              onChange={handleNewThreadDescriptionChange}
            ></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="newThreadCategory" className="form-label">
              Category:
            </label>
            <input
              type="text"
              className="form-control"
              id="newThreadCategory"
              value={newThreadCategory}
              onChange={handleNewThreadCategoryChange}
            />
          </div>

          <button className="btn btn-primary mb-3" onClick={handleCreateThread}>
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
      ) : filteredThreads.length === 0 ? (
        <p>No threads available</p>
      ) : (
        <div className="row">
          {filteredThreads.map((thread) => (
            <div key={thread._id} className="col-md-4 mb-4">
              <div
                className="card h-100"
                onClick={() => navigateToPosts(thread._id)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-body">
                  <h5 className="card-title">{thread.title}</h5>
                  <p className="card-text">{thread.description}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      Category: {thread.category}
                    </small>
                  </p>
                  <p className="card-text">
                    <small className="text-muted">
                      Created By: <strong>{thread.owner.username}</strong>
                    </small>
                  </p>
                  <p className="card-text">
                    <small className="text-muted">
                      Created At: {new Date(thread.createdAt).toLocaleString()}
                    </small>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
