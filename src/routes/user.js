const express = require('express');
const UserRouter = express.Router();
const {User} = require('../models/user');
const {userAuth} = require('../middleware/auth');
const {ConnectionRequest} = require('../models/connectionrequest');


UserRouter.get('/requests/recived' , userAuth , async (req , res)=>{
    try {
        const logginedUser = req.user;
        const requests = await ConnectionRequest.find({
            toUserid: logginedUser._id,
            status: 'intrested'
        }).populate('fromUserid' , 'firstName lastName skills photoUrl about');
        res.status(200).json({requests});
    } catch (error) {
        res.status(500).json({error: 'Error fetching requests: ' + error.message});
    }
});

UserRouter.get('/requests/connections' , userAuth , async (req,res)=>{
    try {
        const logineduser = req.user;
        const connections = await ConnectionRequest.find({
            $or:[
                {fromUserid: logineduser._id},  
                {toUserid: logineduser._id}
            ],
            status: 'accepted'
        }).populate('fromUserid', 'firstName lastName skills photoUrl about')
        .populate('toUserid', 'firstName lastName skills photoUrl about');


        const data = connections.map( (c)=>{
            if(c.fromUserid._id.equals(logineduser._id)){
                return c.toUserid;
            } else {
                return c.fromUserid;
            }
        })
        res.status(200).json({datas: data});
    } catch (error) {
        res.status(500).json({error: 'Error fetching connections: ' + error.message});
    }
})
UserRouter.get('/requests/feed/:page/:limit', userAuth, async (req,res)=>{
    try {
        const logineduser = req.user;
        const page  = req.params.page || 1;
        const limit = req.params.limit || 10;
        const connections = await ConnectionRequest.find({
            $or:[
                {fromUserid: logineduser._id},  
                {toUserid: logineduser._id} 
            ]
        }).select('fromUserid toUserid ');
        const hideusers = new Set();
        connections.forEach((c)=>{
            hideusers.add(c.fromUserid);
            hideusers.add(c.toUserid);
        })
        hideusers.add(logineduser._id);
        const feedusers = await User.find({
            _id: { $nin: Array.from(hideusers) }
        }).select('firstName lastName skills photoUrl about').skip((page -1 ) * limit).limit(limit);

        
        res.status(200).json({feedusers});

    } catch (error) {
        
    }
})
module.exports = {UserRouter};
        

