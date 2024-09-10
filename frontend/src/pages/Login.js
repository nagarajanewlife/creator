import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup } from "../components/firebase";
import Button from "@mui/material/Button";

function Login() {
  const navigate = useNavigate();

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((userData) => {
        const user = {
          uid: userData.user.uid,
          displayName: userData.user.displayName,
          email: userData.user.email,
          photoURL: userData.user.photoURL,
        };
        console.log("send data", userData);

        axios
          .post("http://localhost:6969/useradd", user)
          .then((response) => {
            console.log("Data successfully sent:", response.data);
            alert("user added sucessfully");
          })
          .catch((error) => {
            console.error("Error sending data:", error);
          });
        // Navigate to /createnewdashbored on successful login

        navigate("/dashboard");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
    >
      <Button variant="contained" color="primary" onClick={signInWithGoogle}>
        Sign in with Google
      </Button>
    </div>
  );
}

export default Login;
