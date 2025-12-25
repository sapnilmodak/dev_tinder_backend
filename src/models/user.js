const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userschema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minlength : 3
    },
    lastName : {
        type : String
    },  
    password : {
        type : String,
        required : true,
        minlength : 6
    },
    gender:{
        type : String,
        validate(value){
            if(!['male' , 'female' , 'other'].includes(value)){
                throw new Error('gender must be male , female or other');
            }
        }
    },
    emailId:{
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email format');
            }
        }
    },
    photoUrl :{
        type : String,
        default: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png',
        validate(value){
            if(!validator.isURL(value)){
                throw new Error('Invalid email format');
            }
        }
    },
    about : {
        type : String,
        default : 'Hey there! I am using DevTinder.'
    },
    skills:{
        type : [String],
    }
} , {timestamps : true});
//creating a helper method to generate JWT
userschema.methods.getJWt =async function(){
    const user = this;
    const token = await jwt.sign({_id : user._id} , 'secret' , {expiresIn : '7d'});
    return token;
}
userschema.methods.verifyPassword = async function(Password){
    const user = this;
    return await bcrypt.compare(Password , user.password);
}
const User = mongoose.model('User' , userschema);

module.exports = {User};

