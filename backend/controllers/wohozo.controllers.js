// Import the models correctly
import {
  Wohozouser,
  Wohozodash,
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
  });

  try {
    const Adduser = await newUserAdd.save();
    return res.status(201).json(Adduser);
  } catch (error) {
    return res.status(400).json({ message: error.message });
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

// get dashboard Application

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
