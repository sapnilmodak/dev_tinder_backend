const express = require('express');
const {userAuth} = require('../middleware/auth');
const {validateProfile} = require('../utils/validation');
const profileRouter = express.Router();


profileRouter.get('/profile' ,userAuth, async (req , res)=>{
  try {
    const user = req.user;
  if(!user){
    return res.status(404).send('User not found');
  }
  res.status(200).send(user);
  } catch (error) {
    res.status(500).send('Error fetching profile'+error);
  }
})

profileRouter.patch('/update' , userAuth , async (req , res)=>{
  try {
    const user = req.user;
    const updates = req.body;
    const allow = validateProfile(updates);
    if(allow){
      Object.keys(updates).forEach((k)=>{
        user[k] = updates[k];
      });
      await user.save();
      return res.status(200).send('Profile updated successfully');
    }
    res.status(404).send('invalid updates');
  } catch (error) {
    res.status(500).send('Error updating profile'+error);
  }
});
profileRouter.patch('/updatePassword' , userAuth , async (req , res)=>{
  try {
    const {  newPassword} = req.body;
    const user = req.user;
    
    user.password = newPassword;
    await user.save();
    res.status(200).send('Password updated successfully');
  } catch (error) {
    res.status(500).send('Error updating password'+error);
  }
})
module.exports = {profileRouter};

