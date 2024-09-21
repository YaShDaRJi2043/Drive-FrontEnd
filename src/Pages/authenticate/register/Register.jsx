import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import BASE_URL from "../../../services/Helper";
import SigninWithGoogle from "../../../Components/firebase/SigninWithGoogle";
import "../Authenticate.css";
import Divider from "@mui/material/Divider";

const Register = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
  });

  const txt = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const btnn = async () => {
    const { FirstName, LastName, Email, Password } = userData;

    const data = new FormData();
    data.append("FirstName", FirstName);
    data.append("LastName", LastName);
    data.append("email", Email);
    data.append("Password", Password);

    BASE_URL.post("/userRegister", data)
      .then((res) => {
        console.log(res);
        localStorage.setItem("email", Email);
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="container">
        <div
          style={{
            border: "solid thin gray",
            borderRadius: "15px",
            padding: "40px",
          }}
        >
          <div>
            <div className="AuthenticateLable">First Name</div>
            <div>
              <input
                type="text"
                name="FirstName"
                onChange={txt}
                className="AuthenticateInput"
                autoComplete="off"
              />
            </div>
          </div>

          <div>
            <div className="AuthenticateLable">Last Name</div>
            <div>
              <input
                type="text"
                name="LastName"
                onChange={txt}
                className="AuthenticateInput"
                autoComplete="off"
              />
            </div>
          </div>

          <div>
            <div className="AuthenticateLable">Email Address</div>
            <div>
              <input
                type="email"
                name="Email"
                onChange={txt}
                className="AuthenticateInput"
                autoComplete="off"
              />
            </div>
          </div>

          <div>
            <div className="AuthenticateLable">Password</div>
            <div>
              <input
                type="password"
                name="Password"
                onChange={txt}
                className="AuthenticateInput"
              />
            </div>
          </div>

          <div>
            <div className="AuthenticateLable">Confirm Password</div>
            <div>
              <input
                type="password"
                name="ConfirmPassword"
                className="AuthenticateInput"
              />
            </div>
          </div>

          <div className="d-flex justify-content-center py-3">
            <button onClick={btnn} className="AuthenticateButton">
              Sign Up
            </button>
            <Divider orientation="vertical" flexItem>
              OR
            </Divider>
            <div>
              <SigninWithGoogle />
            </div>
          </div>

          <div className="d-flex justify-content-center">
            <div>Have an account?</div>
            <NavLink to="/" className="text-decoration-none ps-1">
              Log in now
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
