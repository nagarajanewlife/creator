// Import the models correctly
import {
  Wohozouser,
  Wohozodash,
  FormTable,
  EmployeeTable,
  TimesheetTable,
} from "../models/wohozo.models.js";

// Create a new user
export const UserCreate = async (req, res) => {
  const newUserAdd = new Wohozouser({
    uid: req.body.uid,
    displayName: req.body.displayName,
    email: req.body.email,
    photoURL: req.body.photoURL,
    role: req.body.role,
  });

  try {
    const Adduser = await newUserAdd.save();
    return res.status(201).json(Adduser);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
export const getUserProfile = async (req, res) => {
  try {
    const user = await Wohozouser.findOne({ uid: req.params.uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new dashboard
export const DashboardCreate = async (req, res) => {
  const newDashboardAdd = new Wohozodash({
    uid: req.body.uid,
    dashName: req.body.dashName,
  });

  try {
    const DashboardAdd = await newDashboardAdd.save();
    return res.status(201).json(DashboardAdd);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
// form taable create
export const FormCreate = async (req, res) => {
  console.log("Request body:", req.body); // Log the request body to check the payload

  const newFormAdd = new FormTable({
    uid: req.body.uid,
    dashid: req.body.dashid,
    formName: req.body.formName,
  });

  try {
    const formAdd = await newFormAdd.save();
    console.log("Form saved:", formAdd); // Log the saved form details
    return res.status(201).json(formAdd);
  } catch (error) {
    console.error("Error saving form:", error); // Log the error
    return res.status(400).json({ message: error.message });
  }
};

//get all form  details
export const Getallforms = async (req, res) => {
  const { uid, dashid } = req.params; // Get UID and dashid from route parameters

  try {
    // Check if both uid and dashid are provided
    if (!uid || !dashid) {
      return res.status(400).json({ message: "UID and dashid are required" });
    }

    // Fetch records based on the provided uid and dashid
    const allforms = await FormTable.find({ uid, dashid });

    // Check if any records are found
    if (allforms.length === 0) {
      return res
        .status(404)
        .json({ message: "No records found for the given UID and dashid" });
    }

    // Return the records if found
    res.status(200).json(allforms);
  } catch (error) {
    console.error("Error fetching forms: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

// get dashboard Applicatio

export const DashboardAppsDetails = async (req, res) => {
  const { uid } = req.params; // Get UID from the route parameter
  try {
    if (!uid) {
      return res.status(400).json({ message: "UID is required" });
    }

    const dashboards = await Wohozodash.find({ uid });
    if (!dashboards.length) {
      return res.status(404).json({ message: "No records found" });
    }
    res.status(200).json(dashboards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const EmployeeCreate = async (req, res) => {
  const newEmpAdd = new EmployeeTable({
    employeeId: req.body.employeeId,
    name: req.body.name,
    hourlyRate: req.body.hourlyRate,
  });

  try {
    const Adduseremp = await newEmpAdd.save();
    return res.status(201).json(Adduseremp);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const Employeeget = async (req, res) => {
  try {
    const employees = await EmployeeTable.find().sort({ name: 1 });
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// TimesheetsAdd

export const TimesheetCreate = async (req, res) => {
  const newtimesheetAdd = new TimesheetTable({
    employee: req.body.employee,
    hoursWorked: req.body.hoursWorked,
    description: req.body.description,
  });

  try {
    const AdduserTimesheet = await newtimesheetAdd.save();
    return res.status(201).json(AdduserTimesheet);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Timesheetsget get

export const Timesheetsget = async (req, res) => {
  try {
    const Timesheetsgetinfo = await TimesheetTable.find().sort({ date: -1 });
    res.json(Timesheetsgetinfo);
  } catch (error) {
    console.error("Error fetching Timesheetsgetinfo:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const Earings = async (req, res) => {
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
    const earnings = await TimesheetTable.aggregate([
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
};
