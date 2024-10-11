import { Schema, model } from "mongoose";

// User schema definition
const userSchema = new Schema({
  uid: {
    type: String,
  },
  displayName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Unique constraint on email
  },
  photoURL: {
    type: String,
  },
  role: {
    type: String,
  },
});

// Dashboard schema definition
const dashSchema = new Schema(
  {
    uid: {
      type: String,
      required: true, // Mark as required if needed
    },
    dashName: {
      type: String,
      required: true, // Mark as required if needed
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);
//form table
const formTable = new Schema(
  {
    uid: {
      type: String,
      required: true, // Mark as required if needed
    },
    dashid: {
      type: String,
      required: true, // Mark as required if needed
    },
    formName: {
      type: String,
      required: true, // Mark as required if needed
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// employes table

const EmployeeSchema = new Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  hourlyRate: {
    type: Number,
    required: true,
    default: 0,
  },
  // Additional fields can be added as needed
});

// TimesheetTable
const TimesheetSchema = new Schema({
  employee: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  hoursWorked: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
  },
});

// Create models
const Wohozouser = model("Wohozouser", userSchema);
const Wohozodash = model("Wohozodash", dashSchema);
const EmployeeTable = model("Employee", EmployeeSchema);
const TimesheetTable = model("Timesheet", TimesheetSchema);
const FormTable = model("FormTable", formTable);

// Export both models
export { Wohozouser, Wohozodash, EmployeeTable, TimesheetTable, FormTable };
