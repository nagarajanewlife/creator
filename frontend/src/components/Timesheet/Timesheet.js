import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Container,
} from "@mui/material";
import axios from "axios";

const Timesheet = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const [description, setDescription] = useState("");
  const [timesheets, setTimesheets] = useState([]);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const fetchTimesheets = async () => {
    try {
      const res = await axios.get(`${backendUrl}/timesheets`);
      setTimesheets(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTimesheets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/timesheets`, {
        employeeId,
        hoursWorked,
        description,
      });
      fetchTimesheets();
      setEmployeeId("");
      setHoursWorked("");
      setDescription("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Employee Timesheet
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Employee ID"
          fullWidth
          margin="normal"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
        />
        <TextField
          label="Hours Worked"
          type="number"
          fullWidth
          margin="normal"
          value={hoursWorked}
          onChange={(e) => setHoursWorked(e.target.value)}
          required
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>

      <Typography variant="h5" gutterBottom style={{ marginTop: "2rem" }}>
        All Timesheets
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee ID</TableCell>
            <TableCell>Hours Worked</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {timesheets.map((ts) => (
            <TableRow key={ts._id}>
              <TableCell>{ts.employeeId}</TableCell>
              <TableCell>{ts.hoursWorked}</TableCell>
              <TableCell>{ts.description}</TableCell>
              <TableCell>{new Date(ts.date).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default Timesheet;
