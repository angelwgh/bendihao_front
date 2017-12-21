const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/myblog')

const db = mongoose.connection;

db.once('open', () =>{
    console.log('数据库连接成功')
})

/**
 * 这里的once继承至nodejs的EventEmitter对象
 * 为open时间添加一个一次性的监听函数,在触发时间后移除这个监听并调用这个函数
 */


module.exports = db;

