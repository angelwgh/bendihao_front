const express = require('express');
const router = express.Router();

var User = require('../modules/db/users')
var idCount = require('../modules/db/ids')

/* GET users listing. */
router.get('/add', function(req, res, next) {
  console.log(req.query)
  idCount.findOneAndUpdate({'idName':'userId'},{$inc: {id:1}},{new: true}, (err, doc)=>{
    console.log(doc.id);
    var param = {
      id: doc.id,
      ...req.query
    }
    User.create(param, ()=>{
      res.send('用户添加成功');
    })
  })
  
    

  return;
  
});

router.get('/getUsers', function(req, res, next) {
  User.find({},{_id:0}, (err, doc)=> {
    res.send(doc)
  })
});

router.get('/updata', (req, res, next)=>{
  console.log(req.query)
  var id = parseInt(req.query.id)

  // User.findOne({"id":id},(err, result) => {
  //   if(err){
  //     res.send("修改数据出现错误,请重新提交")
  //   }
  //   console.log(result)
  //   res.send('查询成功')
  // })
  User.update({"id":id},req.query,(err,result)=>{
    if(err){
      console.log(err)
      return
    }
    res.send('修改成功')

  })
})

router.get('/delete', (req, res, next) => {
  var id = parseInt(req.query.id)
  User.remove({"id":id} , (err, result) =>{
    if(err){
      console.log(err)
      return
    }
    res.send('删除成功')
  })
})

module.exports = router;
