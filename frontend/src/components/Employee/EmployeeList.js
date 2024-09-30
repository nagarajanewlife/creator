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

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${backendUrl}/employees`);
        setEmployees(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employees:", error);
        // alert("Failed to fetch employees.");
        setLoading(false);
      }
    };

    fetchEmployees();
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
              <strong>Hourly Rate ($)</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((emp) => (
            <TableRow key={emp._id}>
              <TableCell>{emp.employeeId}</TableCell>
              <TableCell>{emp.name}</TableCell>
              <TableCell>{emp.hourlyRate.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AnimatedTableContainer>
  );
};

export default EmployeeList;
