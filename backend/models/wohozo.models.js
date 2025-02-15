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
// form field table

const FormItemTables = new Schema(
  {
    uid: {
      type: String,
      required: true, // User ID, required
    },
    appid: {
      type: String,
      required: true, // Application ID, required
    },
    formid: {
      type: String,
      required: true, // Form ID, required
    },
    formItems: [
      {
        id: { type: String, required: true }, // Unique identifier for the form item
        type: { type: String, required: true }, // Type of form item (e.g., "Address", "Single Line")
        design: {
          label: { type: String, required: true }, // Label for the form item
        },
        position: { type: String, required: true }, // Position in the form
        properties: {
          type: Schema.Types.Mixed, // To accommodate dynamic properties
        },
        uniqueId: { type: String, required: true }, // Unique identifier for the item
        value: { type: String, default: "" }, // Default value
      },
    ],
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);
// Define the Schema for the entire form

//DynamicModelFormTable
const dynamicFormSchema = new Schema(
  {
    uid: { type: String, required: true }, // Static field: must always be present
    dashid: { type: String, required: true }, // Static field: must always be present
    formnames: { type: String, required: true }, // Static field: must always be present
  },
  { strict: false }
); // Allow other dynamic fields not specified in the schema

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
// const formItTable = new Schema({
//   formItems: [formItemTable], // An array of form items
//   createdAt: { type: Date, default: Date.now },
// });

// Create a Mongoose model
// userTable
const Wohozodash = model("DashApplication", dashSchema);
const FormTable = model("FormTable", formTable);
const FormItemTable = model("FormIteamTable", FormItemTables);
const DynamicModelFormTable = model("DynamicFormTable", dynamicFormSchema);

// admin Table
const Wohozouser = model("Wohozouser", userSchema);
const EmployeeTable = model("Employee", EmployeeSchema);
const TimesheetTable = model("Timesheet", TimesheetSchema);

// Export both models
export {
  Wohozouser,
  Wohozodash,
  EmployeeTable,
  TimesheetTable,
  FormTable,
  FormItemTable,
  DynamicModelFormTable,
};
