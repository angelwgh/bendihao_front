// 
var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    id:Number,
    username: String,
    password: Number,
    rank: Number,
    regtime:Date,
    updatatime:Date
})

var User = mongoose.model("User",userSchema)

module.exports = User