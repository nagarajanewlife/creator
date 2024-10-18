import React from "react";
import "./home.css";
import Login from "./AuthPage";
export default function Home() {
  return (
    <div>
      <div
        style={{
          display: "flex",
        }}
      >
        <div className="bg">
          <b>Build powerful applications faster</b>
        </div>
        <div></div>
        <Login />
      </div>
    </div>
  );
}
