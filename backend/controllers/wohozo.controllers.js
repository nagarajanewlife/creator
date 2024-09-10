import WohozoModel from "../models/wohozo.models.js";

export const UserCreate = async (req, res) => {
  const newUserAdd = new WohozoModel({
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
