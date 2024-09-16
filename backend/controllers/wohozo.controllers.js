// Import the models correctly
import { Wohozouser, Wohozodash } from "../models/wohozo.models.js";

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
