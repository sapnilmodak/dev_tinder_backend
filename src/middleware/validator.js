
const sanitizer = (req , res , next)=>{
    try {
        const allowedData = ['firstName' , 'lastName' , 'emailId' , 'password' , 'gender' , 'photoUrl' , 'about' , 'skills'];
        const data = req.body;
        Object.keys(data).forEach((k)=>{
            if(!allowedData.includes(k)){
                throw new Error('Invalid field: ' + k);
            }   
        });
       

        next();
    } catch (error) {
        res.status(400).send('Validation Error: ' + error.message);
    }
}
module.exports = {sanitizer};

