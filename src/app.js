const express = require('express');
const app = express();
const {connectDB} = require('./config/database');
const cookieparser = require('cookie-parser');
const {authRouter} = require('./routes/auth');
const {profileRouter} = require('./routes/profile');
const {requestRouter} = require('./routes/request');
const {UserRouter} = require('./routes/user');
app.use(express.json());
app.use(cookieparser());


app.use('/auth', authRouter);
app.use('/user', profileRouter);
app.use('/connection', requestRouter);
app.use('/follows', UserRouter);
connectDB().then(()=>{
    console.log('Ready to accept requests');
    app.listen(7777 , ()=>{
    console.log('server is running on http://localhost:7777');
})
}).catch((err)=>{
    console.log('Database connection failed', err);
})

