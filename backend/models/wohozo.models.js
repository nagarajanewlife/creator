import { Schema, model } from "mongoose";
const schema = new Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  photoURL: {
    type: String,
  },
});
// Create your model
const Wohozouser = model("Wohozouser", schema);

export default Wohozouser;
