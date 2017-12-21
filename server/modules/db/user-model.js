// 
var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    id:Number,
    username: String,
    password: String,
    rank: Number,
    regtime:Date,
    updatatime:Date
})

var UserModel = mongoose.model("User",userSchema)

module.exports = UserModel