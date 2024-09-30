import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";
import { useSpring, animated } from "react-spring";

const AnimatedPaper = animated(Paper);

const TimesheetForm = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [employees, setEmployees] = useState([]);
  const [hoursWorked, setHoursWorked] = useState("");
  const [description, setDescription] = useState("");

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${backendUrl}/employees`);
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
        // alert("Failed to fetch employees.");
      }
    };

    fetchEmployees();
  }, [backendUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeId || !hoursWorked) {
      // alert("Please fill in all required fields.");
      return;
    }

    try {
      await axios.post(`${backendUrl}/timesheets`, {
        employee: employeeId,
        hoursWorked: parseFloat(hoursWorked),
        description,
      });
      alert("Timesheet submitted successfully!");
      // Clear form
      setEmployeeId("");
      setHoursWorked("");
      setDescription("");
      // Optionally, trigger a refresh of the timesheet list
      window.location.reload();
    } catch (error) {
      console.error("Error submitting timesheet:", error);
      // alert("Failed to submit timesheet.");
    }
  };

  // Animation for the form
  const props = useSpring({ opacity: 1, from: { opacity: 0 }, delay: 300 });

  return (
    <AnimatedPaper elevation={3} sx={{ p: 3, mb: 4 }} style={props}>
      <Typography variant="h6" gutterBottom>
        Submit Timesheet
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="employee-label">Employee</InputLabel>
          <Select
            labelId="employee-label"
            value={employeeId}
            label="Employee"
            onChange={(e) => setEmployeeId(e.target.value)}
          >
            {employees.map((emp) => (
              <MenuItem key={emp._id} value={emp._id}>
                {emp.name} ({emp.employeeId})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Hours Worked"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={hoursWorked}
          onChange={(e) => setHoursWorked(e.target.value)}
          required
          inputProps={{ min: 0, step: "0.1" }}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Submit
        </Button>
      </Box>
    </AnimatedPaper>
  );
};

export default TimesheetForm;
