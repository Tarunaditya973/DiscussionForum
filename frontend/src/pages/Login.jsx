import { Link } from "react-router-dom";
import "../css/Login.css";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from "../utils/ApiRoutes";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    theme: "dark",
    pauseOnHover: true,
    autoClose: 8000,
    draggable: true,
  };

  const getCookies = () => {
    return document.cookie.split(";").reduce((cookies, cookie) => {
      const [name, value] = cookie.trim().split("=");
      cookies[name] = value;
      return cookies;
    }, {});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      toast.error("Please fill all the fields", toastOptions);
    }
    try {
      const response = await axios.post(
        loginRoute,
        {
          email,
          password,
        },
        {
          withCredentials: true, // Include credentials
        }
      );
      console.log("response", response);
      if (!response.data.status) {
        toast.error(response.data.message, toastOptions);
      } else {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success(response.data.message, toastOptions);
        navigate("/threads");
      }
    } catch (err) {
      toast.error(err.response.data.message, toastOptions);
    }
  };
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <h2 className="text-center text-dark mt-5">Login Form</h2>
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
                    width="200px"
                    alt="profile"
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    aria-describedby="emailHelp"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-color px-5 mb-5 w-100"
                  >
                    Login
                  </button>
                </div>
                <div
                  id="emailHelp"
                  className="form-text text-center mb-5 text-dark"
                >
                  Not Registered?{" "}
                  <Link to="/signup" className="text-dark fw-bold">
                    Create an Account
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
}
