const validating = (data)=>{
    const allowedData = ['firstName' , 'lastName' , 'emailId' , 'password' , 'gender' , 'photoUrl' , 'about' , 'skills'];
        Object.keys(data).forEach((k)=>{
            if(!allowedData.includes(k)){
                throw new Error('Invalid field: ' + k);
            }   
        });
        return true;
}
const validateProfile = (data)=>{
    const allowedData = ['firstName' , 'lastName' , 'emailId'  , 'gender' , 'photoUrl' , 'about' , 'skills'];
        Object.keys(data).forEach((k)=>{
            if(!allowedData.includes(k)){
                throw new Error('Invalid field: ' + k);
            }   
        });

        return true;
}

module.exports = {validating , validateProfile};

