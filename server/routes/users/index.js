const express = require('express');
const userController = require('../../controllers/userController')
const router = express.Router();


// var UserModel = require('../../modules/db/user-model')
// var idCount = require('../../modules/db/ids')

/* GET users listing. */
// router.get('/add', function(req, res, next) {
//   console.log(req.query)
//   idCount.findOneAndUpdate({'idName':'userId'},{$inc: {id:1}},{new: true}, (err, doc)=>{
//     console.log(doc.id);
//     var param = {
//       id: doc.id,
//       ...req.query
//     }
//     User.create(param, ()=>{
//       res.send('用户添加成功');
//     })
//   })
  
    

//   return;
  
// });

// router.get('/getUsers', function(req, res, next) {
//   User.find({},{_id:0}, (err, doc)=> {
//     res.send(doc)
//   })
// });

// router.get('/updata', (req, res, next)=>{
//   console.log(req.query)
//   var id = parseInt(req.query.id)

//   // User.findOne({"id":id},(err, result) => {
//   //   if(err){
//   //     res.send("修改数据出现错误,请重新提交")
//   //   }
//   //   console.log(result)
//   //   res.send('查询成功')
//   // })
//   User.update({"id":id},req.query,(err,result)=>{
//     if(err){
//       console.log(err)
//       return
//     }
//     res.send('修改成功')

//   })
// })

// router.get('/delete', (req, res, next) => {
//   var id = parseInt(req.query.id)
//   User.remove({"id":id} , (err, result) =>{
//     if(err){
//       console.log(err)
//       return
//     }
//     res.send('删除成功')
//   })
// })



// 注册时检测用户名是否已经被使用

router.get('/checkUsername', (req, res) => {
  const username = req.query.username
  userController.checkUsername(username)
    .then((result)=>{
      res.send(result)
    })
    .catch( (err)=>{
      res.send(err)
    })
})
// 注册
router.post('/signup', (req, res, next) => {
  console.log(req.body)
  userController.signup(req.body)
  .then((result)=>{
    console.log(result)
    res.send(result)
  })
})

// 登陆
router.get('/login', (req, res, next) => {
  console.log(req.query)
  userController.login(req.query)
  .then((result)=>{
    // console.log(result)
    req.session.username = req.query.username;
    res.send(result)
  })
  .catch( (err)=>{
    res.send(err)
  })

 
})

// 获取用户信息
router.get('/queryUserInfo', (req, res, next) => {
  console.log(req.session)
  res.send(req.session.username)
})
module.exports = router;
