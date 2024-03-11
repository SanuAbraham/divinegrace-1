import express from "express";
import Family from '../models/familyModel.js'
import User from '../models/userModel.js'
import RetreatRegistration from '../models/retreatRegistration.js'
import expressAsyncHandler from 'express-async-handler';
//import { generateToken } from "../utils.js";

const familyRouter = express.Router();

familyRouter.post('/familyMember', async (req, res) => {
    try {
      const { retreatRegistrationId, ...familyMemberData } = req.body;
      
      // Check if the user exists
      const retreatRegistration = await RetreatRegistration.findById(retreatRegistrationId);
      if (!retreatRegistration) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Create a family member associated with the user
      const familyMember = new Family({
        ...familyMemberData,
        retreatRegistration: retreatRegistrationId,
      });
  
      const savedFamilyMember = await familyMember.save();
      res.json(savedFamilyMember);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get all family members for a specific user
familyRouter.get('/familyMember/:retreatRegistrationId', async (req, res) => {
    try {
      const retreatRegistrationId = req.params.retreatRegistrationId;
  
      // Check if the user exists
      const retreatRegistration = await RetreatRegistration.findById(retreatRegistrationId);
      if (!retreatRegistration) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Retrieve family members associated with the user
      const familyMembers = await Family.find({ retreatRegistration: retreatRegistrationId });
      res.json(familyMembers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

export default familyRouter;