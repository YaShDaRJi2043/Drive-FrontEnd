import React, { useState } from "react";
import { auth, provider } from "./Config";
import { signInWithPopup } from "firebase/auth";
import BASE_URL from "../../services/Helper";
import { useNavigate } from "react-router-dom";

const SigninWithGoogle = () => {
  const [googleUserData, setGoogleUserData] = useState();

  const navigate = useNavigate();

  const handleClick = () => {
    signInWithPopup(auth, provider).then((googleData) => {
      setGoogleUserData(googleData.user);
      console.log(googleUserData);

      const data = new FormData();
      data.append("displayName", googleData.user.displayName);
      data.append("email", googleData.user.email);

      BASE_URL.post("/googleUserRegister", data)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));

      localStorage.setItem("userToken", googleData.user.accessToken);
      localStorage.setItem("email", googleData.user.email);
      navigate("/mystorage");
    });
  };

  return (
    <>
      <div>
        <button
          onClick={handleClick}
          style={{
            display: "flex",
            backgroundColor: "white",
            border: "solid thin grey",
            borderRadius: "5px",
            padding: "10px 20px",
            fontSize: "16px",
            fontWeight: "500",
            fontFamily: "revert-layer",
          }}
        >
          <div className="p-1">
            <img src="/Google Logo.webp" alt="img" height="20px" />
          </div>
          <div className="p-1">Google</div>
        </button>
      </div>
    </>
  );
};

export default SigninWithGoogle;
