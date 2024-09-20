import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../components/firebase"; // assuming you have this file for Firebase config
import Button from "@mui/material/Button";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

export default function Dashboard() {
  const [uid, setUid] = useState(null); // Store user UID
  const [dashName, setDashName] = useState(""); // Store dashboard name input
  const [dashapps, setDashApps] = useState("");
  const [open, setOpen] = useState(false); // Modal open state
  const navigate = useNavigate();

  // Fetch user data from Firebase Auth on component load
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUid(user.uid); // Set UID from authenticated user
    } else {
      navigate("/"); // Redirect to login if user not authenticated
    }
  }, [navigate]);
  useEffect(() => {
    getApplication();
  }, []);

  const getApplication = () => {
    axios
      .get(
        "http://localhost:6969/dashboardApplication/JP6NSsZlhNVZlAGRngzda5tcu0d2"
      )
      .then((response) => {
        console.log("get Dashboard Apps:", response.data);
        setDashApps(response.data);
      })
      .catch((error) => {
        console.error("Error get dashboard Apps:", error);
      });
  };

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

  const handleCreateDashboard = () => {
    if (!dashName) {
      alert("Please enter a dashboard name!");
      return;
    }

    const sendData = { uid: uid, dashName: dashName };
    console.log("senddata", sendData);
    axios
      .post("http://localhost:6969/createDashboard", sendData)
      .then((response) => {
        console.log("Dashboard created successfully:", response.data);
        alert("Dashboard created successfully!");
        setOpen(false); // Close modal after creation
        setDashName(""); // Clear the input after creation
      })
      .catch((error) => {
        console.error("Error creating dashboard:", error);
        alert("Error creating dashboard.");
      });
  };

  // Open modal for creating dashboard
  const handleOpen = () => {
    setOpen(true);
  };

  // Close modal without creating dashboard
  const handleClose = () => {
    setOpen(false);
    setDashName(""); // Reset the dashboard name input
  };
  console.log("dashapps", dashapps);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Logout
      </Button>

      <div style={{ marginTop: "20px" }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          + New Application
        </Button>
      </div>
      <div>
        {/* Check if dashapps exists and has items */}
        {dashapps ? (
          dashapps.map((arg) => (
            <div
              key={arg._id}
              // onClick={() => handleClick(arg.uid)} // onClick event passes uid
              style={{
                width: "230px",
                height: "233px",
                border: "1px solid black",
                padding: "10px",
                margin: "10px",
                cursor: "pointer",
                background: "#80808042",
              }}
            >
              {/* Display the dashName */}
              {arg.dashName}
            </div>
          ))
        ) : (
          <p>No dashboards available.</p>
        )}
      </div>

      {/* Dialog (Popup) for Dashboard Creation */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Application</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Dashboard Name"
            fullWidth
            value={dashName}
            onChange={(e) => setDashName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateDashboard} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
