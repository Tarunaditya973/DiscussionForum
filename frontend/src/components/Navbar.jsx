import { Link } from "react-router-dom";

export default function Navbar() {
  const handleLogout = () => {
    // Implement your logout logic here
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img
            src="/path/to/your/logo.png"
            alt="Logo"
            height="30"
            className="d-inline-block align-top"
          />
        </Link>

        {/* Toggler/collapsible Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
          <ul className="navbar-nav">
            {/* Logout Button */}
            <li className="nav-item">
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
