import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";
import { useSpring, animated } from "react-spring";

const AnimatedPaper = animated(Paper);

const MonthlyEarnings = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // JavaScript months are 0-based
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/earnings/${year}/${month}`
      );
      setEarnings(response.data.earnings);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching earnings:", error);
      //   alert("Failed to fetch earnings.");
      setLoading(false);
    }
  };

  // Animation for the component
  const props = useSpring({ opacity: 1, from: { opacity: 0 }, delay: 300 });

  return (
    <AnimatedPaper elevation={3} sx={{ p: 3, mb: 4 }} style={props}>
      <Typography variant="h6" gutterBottom>
        Monthly Earnings Calculation
      </Typography>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
        <FormControl>
          <InputLabel id="year-label">Year</InputLabel>
          <Select
            labelId="year-label"
            value={year}
            label="Year"
            onChange={(e) => setYear(e.target.value)}
            sx={{ width: 120 }}
          >
            {Array.from(
              new Array(10),
              (val, index) => new Date().getFullYear() - index
            ).map((yr) => (
              <MenuItem key={yr} value={yr}>
                {yr}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="month-label">Month</InputLabel>
          <Select
            labelId="month-label"
            value={month}
            label="Month"
            onChange={(e) => setMonth(e.target.value)}
            sx={{ width: 150 }}
          >
            {[
              { value: 1, label: "January" },
              { value: 2, label: "February" },
              { value: 3, label: "March" },
              { value: 4, label: "April" },
              { value: 5, label: "May" },
              { value: 6, label: "June" },
              { value: 7, label: "July" },
              { value: 8, label: "August" },
              { value: 9, label: "September" },
              { value: 10, label: "October" },
              { value: 11, label: "November" },
              { value: 12, label: "December" },
            ].map((m) => (
              <MenuItem key={m.value} value={m.value}>
                {m.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCalculate}
          disabled={loading}
        >
          {loading ? "Calculating..." : "Calculate Earnings"}
        </Button>
      </Box>
      {earnings.length > 0 && (
        <TableContainer component={Paper}>
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
                  <strong>Total Hours</strong>
                </TableCell>
                <TableCell>
                  <strong>Hourly Rate (Rs)</strong>
                </TableCell>
                <TableCell>
                  <strong>Total Earnings (Rs)</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {earnings.map((emp) => (
                <TableRow key={emp.employeeId}>
                  <TableCell>{emp.employeeId}</TableCell>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.totalHours}</TableCell>
                  <TableCell>{emp.hourlyRate.toFixed(2)}</TableCell>
                  <TableCell>{emp.totalEarnings.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </AnimatedPaper>
  );
};

export default MonthlyEarnings;
