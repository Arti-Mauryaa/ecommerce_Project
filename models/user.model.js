const mongoose = require("mongoose")

/**userSchema----
 * name
 * userId
 * password
 * email
 * userType
 */
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    userId : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        lowercase : true,
        minLength : 10,
        unique : true
    },
    usertype : {
        type : String,
        required : true,
        default : "CUSTOMER",
        enum : ["CUSTOMER", "ADMIN"]
    }
},{timestamps : true, versionKey : false})

//create user collection --- users

module.exports = mongoose.model("User", userSchema)

