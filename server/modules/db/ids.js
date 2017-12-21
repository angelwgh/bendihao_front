/**
 * 保存唯一的id
 */

var mongoose = require("mongoose");

var idSchema = new mongoose.Schema({
    id:Number,
    idName:String
})

var Id = mongoose.model("id",idSchema)

module.exports = Id