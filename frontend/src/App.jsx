import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function App() {
  const navigate = useNavigate();
  if (!localStorage.getItem("user")) {
    navigate("/");
  } else {
    navigate("/login");
  }
  return <></>;
}
