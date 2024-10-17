// Import the models correctly
import {
  Wohozouser,
  Wohozodash,
  FormTable,
  FormItemTable,
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

// creare form filed
export const FormFieldCreate = async (req, res) => {
  const { uid, appId, formId, inputs } = req.body; // Destructure from request body

  try {
    // Check if a form already exists with the given uid, appId, and formId
    const existingForm = await FormItemTable.findOneAndUpdate(
      { uid, appid: appId, formid: formId }, // Find by these criteria
      { formItems: inputs }, // Update the formItems with the new inputs
      { new: true, upsert: true } // 'new' returns the updated document, 'upsert' creates a new one if not found
    );

    // Respond with the updated or newly created form data
    res.status(existingForm ? 200 : 201).json(existingForm);
  } catch (error) {
    console.error("Error saving or updating form:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// getParticularFileld
export const getParticularFileld = async (req, res) => {
  const { uid, appid, formid } = req.query; // Get parameters from the query string

  try {
    // Find the form in the database
    const form = await FormItemTable.findOne({ uid, appid, formid });

    if (!form) {
      return res.status(404).json({ message: "Form not found not" });
    }

    res.status(200).json(form); // Respond with the found form
  } catch (error) {
    console.error("Error retrieving form:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
export const getAllFileld = async (req, res) => {
  const { uid, appid } = req.query; // Get parameters from the query string

  try {
    // Find the form in the database
    const form = await FormItemTable.findOne({ uid, appid });

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.status(200).json(form); // Respond with the found form
  } catch (error) {
    console.error("Error retrieving form:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
//get all form  details
export const Getallforms = async (req, res) => {
  const { uid } = req.params; // Get UID and dashid from route parameters
  console.log("uid", uid);
  try {
    // Check if both uid and dashid are provided
    if (!uid) {
      return res.status(400).json({ message: "UID and dashid are required" });
    }

    // Fetch records based on the provided uid and dashid
    const allforms = await FormTable.find({ uid });

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
// getFormList
export const getFormList = async (req, res) => {
  const { uid } = req.params; // Change to req.params if using path params
  console.log("uid, appId:", uid);

  if (!uid) {
    return res.status(400).json({ message: "Missing uid or appId in request" });
  }

  try {
    // Use 'dashid' if that's the correct field name in your database
    const form = await FormTable.find({ uid });
    console.log("Retrieved form:", form);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.status(200).json(form);
  } catch (error) {
    console.error("Error retrieving form:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
export const getFormIteam = async (req, res) => {
  const { uid, appId, formId } = req.params; // Get parameters from request URL
  console.log(uid, appId, formId);
  try {
    // Find the form using the provided uid, appId, and formId
    const form = await FormItemTable.findOne({
      uid, // User ID
      appid: appId, // Application ID
      formid: formId, // Form ID
    });

    // Check if form exists
    if (!form) {
      return res.status(404).json({ message: "Form not found ok" });
    }

    // Respond with the found form
    res.status(200).json(form);
  } catch (error) {
    console.error("Error fetching form:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
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
