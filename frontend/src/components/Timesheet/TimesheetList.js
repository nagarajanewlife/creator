import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useSpring, animated } from "react-spring";

const AnimatedTableContainer = animated(TableContainer);

const TimesheetList = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [employees, setEmployees] = useState({});
  const [loading, setLoading] = useState(true);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [timesheetRes, employeeRes] = await Promise.all([
          axios.get(`${backendUrl}/timesheets`),
          axios.get(`${backendUrl}/employees`),
        ]);

        setTimesheets(timesheetRes.data);
        // Create a mapping of employee ID to name and rate
        const empMap = {};
        employeeRes.data.forEach((emp) => {
          empMap[emp._id] = { name: emp.name, employeeId: emp.employeeId };
        });
        setEmployees(empMap);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        // alert("Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchData();
  }, [backendUrl]);

  // Animation for the table
  const props = useSpring({ opacity: 1, from: { opacity: 0 }, delay: 400 });

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <AnimatedTableContainer component={Paper} style={props}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Employee ID</strong>
            </TableCell>
            <TableCell>
              <strong>Name</strong>
            </TableCell>
            <TableCell>
              <strong>Hours Worked</strong>
            </TableCell>
            <TableCell>
              <strong>Description</strong>
            </TableCell>
            <TableCell>
              <strong>Date</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {timesheets.map((ts) => (
            <TableRow key={ts._id}>
              <TableCell>
                {employees[ts.employee]?.employeeId || "N/A"}
              </TableCell>
              <TableCell>{employees[ts.employee]?.name || "N/A"}</TableCell>
              <TableCell>{ts.hoursWorked}</TableCell>
              <TableCell>{ts.description || "N/A"}</TableCell>
              <TableCell>{new Date(ts.date).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AnimatedTableContainer>
  );
};

export default TimesheetList;
