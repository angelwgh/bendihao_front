const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/myblog')

const db = mongoose.connection;

db.once('open', () =>{
    console.log('数据库连接成功')
})

module.exports = db;

