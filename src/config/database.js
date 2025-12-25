const mongoose = require('mongoose');

const connectDB = async ()=>{
    await mongoose.connect('mongodb+srv://sapnil:Fugr0123%23@cluster0.iin3x.mongodb.net/?appName=Cluster0/devtinder');
    console.log('database connected successfully');
}
module.exports = {connectDB};

