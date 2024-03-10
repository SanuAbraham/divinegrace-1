import express from "express";
import Family from '../models/familyModel.js'
import User from '../models/userModel.js'
import expressAsyncHandler from 'express-async-handler';
//import { generateToken } from "../utils.js";
import RetreatRegistration from "../models/retreatRegistration.js";

const retreatRegistrationRouter = express.Router();

retreatRegistrationRouter.post('/retreatRegistration', async (req, res) => {
  try {
    const { userId, ...retreatRegistrationData } = req.body;
    const user = await User.findById(userId);
    res.json(user);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const retreatRegistration = new RetreatRegistration({
      ...retreatRegistrationData,
      user: userId,
    });

    const savedretreatRegistration = await retreatRegistration.save();
    const familyMemberData = {
      name:user.name,
      email: user.email,
      phone: user.phone,
      age: user.age,
      gender: user.gender,
      relationship: "Self"
    }
    const familyMember = new Family({
      ...familyMemberData,
      retreatRegistration: savedretreatRegistration._id,
    });
    const savedFamilyMember = await familyMember.save();
    res.json(savedretreatRegistration);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

  // Get all retreatRegistration for a specific user
  retreatRegistrationRouter.get('/retreatRegistration', async (req, res) => {
    try {
      const { userID, retreatID } = req.query;
  
      // Check if both userID and retreatID are provided in the query parameters
      if (!userID || !retreatID) {
        return res.status(400).json({ error: 'Both userID and retreatID are required in the query parameters' });
      }
  
      // Query the collection using Mongoose
      const records = await RetreatRegistration.find({ user: userID, product: retreatID });
  
      res.json(records);
    } catch (error) {
      console.error('Error retrieving records:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

export default retreatRegistrationRouter;