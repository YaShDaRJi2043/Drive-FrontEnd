import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import BASE_URL from "../../../services/Helper";
import SigninWithGoogle from "../../../Components/firebase/SigninWithGoogle";
import "../Authenticate.css";
import Divider from "@mui/material/Divider";
import Spinner from "../../../Components/spinner/Spinner";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    Email: "",
    Password: "",
  });
  const [loading, setLoading] = useState(false);

  const txt = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const btnn = async () => {
    const { Email, Password } = userData;

    if (Email === "") {
      toast.warning("Enter a Email!!");
    } else if (Password === "") {
      toast.warning("Enter a Password!!");
    } else {
      const data = new FormData();
      data.append("Email", Email);
      data.append("Password", Password);

      setLoading(true);

      BASE_URL.post("/userLogin", data)
        .then((res) => {
          console.log(res);
          localStorage.setItem("userToken", res.data.tokan);
          localStorage.setItem("email", Email);
          navigate("/mystorage");
        })
        .catch((err) => {
          console.log(err?.response?.data?.message);
          toast.warning(err?.response?.data?.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <>
      {loading && (
        <div className="spinner">
          <Spinner />
        </div>
      )}
      <div className="container">
        <div
          style={{
            border: "solid thin gray",
            borderRadius: "15px",
            padding: "40px",
          }}
        >
          <div>
            <div className="AuthenticateLable">Email Address</div>
            <input
              type="text"
              name="Email"
              onChange={txt}
              className="AuthenticateInput"
              autoComplete="off"
            />
          </div>

          <div>
            <div className="AuthenticateLable">password</div>
            <input
              type="password"
              name="Password"
              onChange={txt}
              className="AuthenticateInput"
            />
          </div>

          <div className="d-flex justify-content-center py-3">
            <button onClick={btnn} className="AuthenticateButton">
              Sign In
            </button>
            <Divider orientation="vertical" flexItem>
              OR
            </Divider>
            <div>
              <SigninWithGoogle />
            </div>
          </div>

          <div className="d-flex justify-content-center">
            <div>Don't have an account?</div>
            <NavLink to="/register" className="text-decoration-none ps-1">
              Sign Up
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
