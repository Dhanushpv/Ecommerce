const mongoose = require('mongoose');
const users = new mongoose.Schema({
    name:{
        type : String,
        // required : true,
    },
    email:{
        type : String,
        // required : true,
    },
    phone_no :{
        type : Number
    },
    password:{
        type : String,
        // required : true,
    },
    usertype:{
        type :mongoose.Schema.Types.ObjectId,
        ref : "usertypes"
    },
});

 let add= mongoose.model("users", users);
 module.exports = add