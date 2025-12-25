const express = require('express');
const {ConnectionRequest} = require('../models/connectionrequest');
const {User} = require('../models/user');
const {userAuth} = require('../middleware/auth');
const requestRouter = express.Router();

requestRouter.post('/Request/:status/:toUserid', userAuth, async (req, res) => {
    try {
        const status = req.params.status;
        const toUserid = req.params.toUserid;
        const fromUserid = req.user._id;
        const toUser = await User.findById(toUserid);
        if (!toUser) {
            return res.status(404).send('To User not found');
        }
        const alreadyRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserid, toUserid },
                { fromUserid: toUserid, toUserid: fromUserid }
            ]
        });

        if (alreadyRequest) {
            return res.status(400).send('Request already exists');
        }
        const allowedstatus = ['ignore' , 'intrested'];
        if (!allowedstatus.includes(status)) {
            return res.status(400).send('Invalid status');
        }
        const newRequest = new ConnectionRequest({
            fromUserid,
            toUserid,
            status
        });
        await newRequest.save();
        res.status(200).json({ message: 'Request sent successfully', request: newRequest });
    } catch (error) {
        res.status(500).json({ error: 'Error sending request: ' + error.message });
    }
});

requestRouter.post('/Review/:status/:requestId' , userAuth , async (req , res)=>{
    try {
        const {status , requestId} = req.params;
        const allowedstatus = ['accepted' , 'rejected'];
        if(!allowedstatus.includes(status)){
            return res.status(400).send('Invalid status');
        }
        const isvalidConnection = await ConnectionRequest.findOne({
            fromUserid: requestId,
            toUserid: req.user._id,
            status: 'intrested'
        })

        if(!isvalidConnection){
            return res.status(400).send('No valid request found to respond');
        }
        isvalidConnection.status = status;
        await isvalidConnection.save();
        res.status(200).json({message: 'Request updated successfully' , request: isvalidConnection});
    } catch (error) {
        res.status(500).json({error: 'Error updating request: ' + error.message});
    }
})


module.exports = {requestRouter};

