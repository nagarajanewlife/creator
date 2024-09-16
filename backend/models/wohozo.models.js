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
});

// Dashboard schema definition
const dashSchema = new Schema({
  uid: {
    type: String,
  },
  dashName: {
    type: String,
  },
});

// Create models
const Wohozouser = model("Wohozouser", userSchema);
const Wohozodash = model("Wohozodash", dashSchema);

// Export both models
export { Wohozouser, Wohozodash };
