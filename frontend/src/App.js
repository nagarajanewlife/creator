import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { auth } from "./components/firebase"; // assuming you have this file for Firebase config
import Playground from "./pages/Playground";
import Dashboard from "./pages/Dashbord";
import Login from "./pages/AuthPage";
import Publish from "./pages/Publish";
import Edit from "./pages/Edit";
import Timesheet from "./components/AdminDashboard/Dashboard";
import Earnings from "./components/Earnings/MonthlyEarnings";
// test commit
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Optionally, you can show a loader
  }

  return (
    <Router>
      <Routes>
        {/* If the user is logged in, navigate to dashboard. Otherwise, show login */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/playground"
          element={user ? <Playground /> : <Navigate to="/" />}
        />
        <Route
          path="/adminDashboard"
          element={user ? <Timesheet /> : <Navigate to="/" />}
        />
        <Route
          path="/publish"
          element={user ? <Publish /> : <Navigate to="/" />}
        />
        <Route
          path="/earnings"
          element={user ? <Earnings /> : <Navigate to="/" />}
        />
        {/* earnings */}
        <Route path="/edit" element={user ? <Edit /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
