const express = require('express');
const app = express();

app.use("/",(req,res)=>{
    res.send('Hello World');
})
app.use("/test" , (req,res)=>{
    res.send('This is a test route');
})

app.listen(7777 , ()=>{
    console.log('server is running on http://localhost:7777');
})