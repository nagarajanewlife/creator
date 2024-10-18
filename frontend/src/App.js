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
import HomePage from "./pages/HomePage";
import Publish from "./pages/Publish";
import Edit from "./pages/Edit";
import Timesheet from "./components/AdminDashboard/Dashboard";
import Earnings from "./components/Earnings/MonthlyEarnings";
import Unauthorized from "./pages/UnauthorizedPage";
import CreateForm from "./pages/CreateForm";
import { DashboardProvider } from ".//pages/DashboardContext"; // Import the provider
import EditForm from "./pages/EditForm";
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
    <DashboardProvider>
      <Router>
        <Routes>
          <Route
            path="/home"
            element={
              user ? (
                <Navigate
                  to={`/userhome/${user?.displayName}/admindashboard`}
                />
              ) : (
                <HomePage />
              )
            }
          />
          {/* If the user is logged in, navigate to dashboard. Otherwise, show login */}
          <Route
            path="/"
            element={
              user ? (
                <Navigate
                  to={`/userhome/${user?.displayName}/admindashboard`}
                />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate
                  to={`/userhome/${user?.displayName}/admindashboard`}
                />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path={`/userhome/${user?.displayName}/admindashboard`} // Remove the backticks and use curly braces for dynamic values
            element={user ? <Dashboard /> : <Navigate to="/" />}
          />
          {/* appbuilder/newlifejannu2022/sss/edit */}
          <Route
            path={`/appbuilder/${user?.displayName}/:AppName/edit`} // Remove the backticks and use curly braces for dynamic values
            element={user ? <CreateForm /> : <Navigate to="/" />}
          />
          <Route
            path={`/appbuilder/${user?.displayName}/:AppName/formbuilder/:FormName/edit`}
            element={user ? <Playground /> : <Navigate to="/" />}
          />
          <Route
            path={`/appbuilder/${user?.displayName}/:AppName/form/:FormName/edit`}
            element={user ? <EditForm /> : <Navigate to="/" />}
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
          {/* <Route path="/edit" element={user ? <Edit /> : <Navigate to="/" />} /> */}
          <Route
            path="/unauthorized"
            element={user ? <Unauthorized /> : <Navigate to="/" />}
          />
          {/* unauthorized */}
        </Routes>
      </Router>
    </DashboardProvider>
  );
}

export default App;
