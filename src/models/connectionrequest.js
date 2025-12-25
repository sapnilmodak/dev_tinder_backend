const mongoose = require('mongoose');
const {User} = require('./user');
const connectionRequestSchema = new mongoose.Schema({
    fromUserid:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    toUserid:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status:{
        type: String,
        enum: ['ignored', 'intrested', 'accepted' , 'rejected'],
    }

} , {timestamps: true});
connectionRequestSchema.index({ fromUserid: 1, toUserid: 1 });
connectionRequestSchema.pre('save', function (next) {
    if (this.toUserid.equals(this.fromUserid)) {
        return next(new Error('Cannot send request to yourself'));
    }
    next();
});

const ConnectionRequest = mongoose.model('ConnectionRequest' , connectionRequestSchema);

module.exports = {ConnectionRequest};

