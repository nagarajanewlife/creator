import React, { useState } from "react";
import { TextField, Button, Box, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useSpring, animated } from "react-spring";

const AnimatedPaper = animated(Paper);

const EmployeeForm = ({ onEmployeeAdded }) => {
  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");

  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:6969";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeId || !name || hourlyRate === "") {
      //alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/employees`, {
        employeeId,
        name,
        hourlyRate: parseFloat(hourlyRate),
      });
      alert("Employee added successfully!");
      setEmployeeId("");
      setName("");
      setHourlyRate("");
      if (onEmployeeAdded) onEmployeeAdded(response.data);
    } catch (error) {
      console.error("Error adding employee:", error);
      //alert("Failed to add employee.");
    }
  };

  // Animation for the form
  const props = useSpring({ opacity: 1, from: { opacity: 0 }, delay: 300 });

  return (
    <AnimatedPaper elevation={3} sx={{ p: 3, mb: 4 }} style={props}>
      <Typography variant="h6" gutterBottom>
        Add New Employee
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Employee ID"
          variant="outlined"
          fullWidth
          margin="normal"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
        />
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Hourly Rate"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
          required
          inputProps={{ min: 0, step: "0.01" }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Add Employee
        </Button>
      </Box>
    </AnimatedPaper>
  );
};

export default EmployeeForm;
