const {validating} = require('../utils/validation');
const cookieparser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {sanitizer} = require('../middleware/validator');
const {User} = require('../models/user');
const express = require('express');
const authRouter = express.Router();


authRouter.post('/signup' ,sanitizer , async (req  , res)=>{

  const {firstName , lastName, emailId, password, skills, about, photoURL, gender} = (req.body);
  
  try {
    hash_password = await bcrypt.hash(password , 10);
    const data = {
      firstName,
      lastName,
      emailId,
      password : hash_password,
      skills,
      about,
      photoURL, 
      gender
    };
    const user = new User(data);
    await user.save();
    res.status(201).send('User created successfully');
  } catch (error) {
    res.status(500).send('Error creating user'+error);
  }
})

authRouter.post('/login' , async (req , res)=>{
  const {emailId , password} = req.body;
  try {
    const user = await User.findOne({emailId : emailId});
    if(!user){
      throw new Error('Invalid Credentials');
    }
    const IsMatch = await user.verifyPassword(password);
    if(!IsMatch){
      throw new Error('Invalid Credentials');
    }
    //getJWT() is in user model
    const token = await user.getJWt();
    res.cookie('token',token , {expires : new Date(Date.now() + 7*24*60*60*1000) });
    res.status(200).send('Login Successful');
  } catch (error) {
    res.status(401).send('Error logging in'+error);
  }
})

authRouter.post('/logout' , async (req , res )=>{
  try {
    res.cookie('token' , '' , {expires : new Date(Date.now())});
    res.status(200).send('Logout Successful');
  } catch (error) {
    res.status(500).send('Error logging out'+error);
  }
})
module.exports = {authRouter};

