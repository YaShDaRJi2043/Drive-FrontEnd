import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import BASE_URL from "../../../services/Helper";
import SigninWithGoogle from "../../../Components/firebase/SigninWithGoogle";
import "../Authenticate.css";
import Divider from "@mui/material/Divider";
import Spinner from "../../../Components/spinner/Spinner";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const txt = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const btnn = async () => {
    const { FirstName, LastName, Email, Password, ConfirmPassword } = userData;

    if (FirstName === "") {
      toast.warn("Enter Your FirstName!!");
    } else if (LastName === "") {
      toast.warn("Enter Your LastName!!");
    } else if (Email === "") {
      toast.warn("Enter a Email!!");
    } else if (Password === "") {
      toast.warn("Enter a Password!!");
    } else if (Password.length < 6) {
      toast.warn("Password Must Have Atleast 6 Digit!!");
    } else if (ConfirmPassword === "") {
      toast.warn("Re-Enter Password!!");
    } else if (Password !== ConfirmPassword) {
      toast.warn("Password And Confirm Password Can Not Matched!!");
    } else {
      const data = new FormData();
      data.append("FirstName", FirstName);
      data.append("LastName", LastName);
      data.append("email", Email);
      data.append("Password", Password);

      setLoading(true);
      BASE_URL.post("/userRegister", data)
        .then((res) => {
          console.log(res);
          localStorage.setItem("email", Email);
          navigate("/");
        })
        .catch((err) => {
          console.log(err?.response?.data?.message);
          toast.warn(err?.response?.data?.message);
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
                onChange={txt}
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
