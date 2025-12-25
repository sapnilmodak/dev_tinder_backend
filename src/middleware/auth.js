const jwt = require('jsonwebtoken');
const {User} = require('../models/user');
const userAuth=async (req , res, next) =>{
    try {
        const token = req.cookies.token;
        const decoded = await jwt.verify(token , 'secret');
        if(!decoded){
            throw new Error('retry login');
        }
        const user_id = decoded._id;
        const user =await User.findById(user_id);
        if(!user){
            throw new Error('no User Found');
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send('Authentication failed: ' + error.message);
    }
}
module.exports = {userAuth};

