const express = require("express");
const router = express.Router();
const Timesheet = require("../models/Timesheet");
const Employee = require("../models/Employee");
const admin = require("../middleware/admin");

// @route   GET /api/earnings/:year/:month
// @desc    Calculate monthly earnings for each employee
// @access  Private/Admin
router.get("/:year/:month", admin, async (req, res) => {
  const { year, month } = req.params;

  // Validate year and month
  const yearNum = parseInt(year, 10);
  const monthNum = parseInt(month, 10);

  if (
    isNaN(yearNum) ||
    isNaN(monthNum) ||
    yearNum < 1900 ||
    yearNum > 2100 ||
    monthNum < 1 ||
    monthNum > 12
  ) {
    return res.status(400).json({ message: "Invalid year or month." });
  }

  // Calculate start and end dates for the month
  const startDate = new Date(yearNum, monthNum - 1, 1);
  const endDate = new Date(yearNum, monthNum, 1);

  try {
    // Aggregate timesheets
    const earnings = await Timesheet.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: "$employee",
          totalHours: { $sum: "$hoursWorked" },
        },
      },
      {
        $lookup: {
          from: "employees", // MongoDB collection name is lowercase and plural
          localField: "_id",
          foreignField: "_id",
          as: "employee",
        },
      },
      {
        $unwind: "$employee",
      },
      {
        $project: {
          _id: 0,
          employeeId: "$employee.employeeId",
          name: "$employee.name",
          hourlyRate: "$employee.hourlyRate",
          totalHours: 1,
          totalEarnings: { $multiply: ["$totalHours", "$employee.hourlyRate"] },
        },
      },
    ]);

    res.json({
      year: yearNum,
      month: monthNum,
      earnings,
    });
  } catch (error) {
    console.error("Error calculating earnings:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
