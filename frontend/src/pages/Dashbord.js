import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../components/firebase"; // assuming you have this file for Firebase config
import Button from "@mui/material/Button";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        navigate("/"); // Redirect to login page after logout
      })
      .catch((error) => {
        console.error("Error during logout: ", error);
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}
