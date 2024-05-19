import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp"; // Ensure this matches your file name
import ThreadsPage from "../pages/ThreadsPage";
import PostPage from "../pages/PostsPage";
import App from "../App";
export const routes = [
  {
    path: "/login",
    element: <Login />,
    title: "Login",
    id: "Login",
  },
  {
    path: "/signup",
    element: <SignUp />,
    title: "Signup",
    id: "Signup",
  },
  {
    path: "/threads",
    element: <ThreadsPage />,
    title: "Threads",
    id: "Threads",
  },
  {
    path: "/posts",
    element: <PostPage />,
    title: "Posts",
    id: "Posts",
  },
  {
    path: "/",
    element: <App />,
    title: "App",
    id: "App",
  },
];

const AppRouter = () => (
  <Router>
    <Routes>
      {routes.map((route) => (
        <Route key={route.id} path={route.path} element={route.element} />
      ))}
    </Routes>
  </Router>
);

export default AppRouter;
