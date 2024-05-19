import React from "react";
import "../css/Signup.css"; // Ensure this CSS file includes any custom styles
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { signUpRoute } from "../utils/ApiRoutes";
const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const toastOptions = {
    position: "bottom-right",
    theme: "dark",
    pauseOnHover: true,
    autoClose: 8000,
    draggable: true,
  };

  const handleValidation = () => {
    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password do not match", toastOptions);
      return false;
    } else if (email === "") {
      toast.error("Email should be presend", toastOptions);
      return false;
    } else if (username.length < 3) {
      toast.error("Username should be more than 3 characters", toastOptions);
    }
    return true;
  };

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (handleValidation()) {
      try {
        const response = await axios.post(
          signUpRoute,
          {
            username,
            email,
            password,
          },
          {
            withCredentials: true, // Include credentials
          }
        );
        if (!response.data.status) {
          toast.error(response.data.message, toastOptions);
        } else {
          navigate("/threads");
          toast.success(response.data.message, toastOptions);
        }
      } catch (error) {
        console.log("error.response", error.response);
        if (error.response) {
          toast.error(error.response.data.message, toastOptions);
        }
      }
    }
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <h2 className="text-center text-dark mt-5">Sign Up</h2>
            <div className="text-center mb-5 text-dark">
              <strong>Discussion Forum</strong>
            </div>
            <div className="card my-5">
              <form
                className="card-body cardbody-color p-lg-5"
                onSubmit={handleSubmit}
              >
                <div className="text-center">
                  <img
                    src="https://cdn.pixabay.com/photo/2016/03/31/19/56/avatar-1295397__340.png"
                    className="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                    width="200"
                    alt="profile"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="Email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="Email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="Username" className="form-label">
                    User Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="Username"
                    placeholder="User Name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Re-enter Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-color px-5 mb-5 w-100"
                  >
                    Signup
                  </button>
                </div>
                <div
                  id="emailHelp"
                  className="form-text text-center mb-5 text-dark"
                >
                  Already have an Account?{" "}
                  <Link to="/login" className="text-dark fw-blod">
                    Login to Existing Account
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default SignUp;
