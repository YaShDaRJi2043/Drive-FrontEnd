import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import Login from "./Pages/authenticate/login/Login";
import Register from "./Pages/authenticate/register/Register";
import MyDrive from "./Pages/my drive/MyDrive";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starred from "./Pages/Starred/Starred";
import RecentImg from "./Pages/recentImg/RecentImg";
import { Toaster } from "sonner";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (token) {
      return navigate("/mystorage");
    } else {
      return navigate("/");
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mystorage" element={<MyDrive />} />
        <Route path="/recent" element={<RecentImg />} />
        <Route path="/starredPic" element={<Starred />} />
      </Routes>
      <Toaster richColors position="top-center" duration={1800} />
    </>
  );
}

export default App;
