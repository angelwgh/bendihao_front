var UserModel = require('../../modules/db/user-model')
var idsModel = require('../../modules/db/ids')

// function UserController () {
//     this.init();
// }
// UserController.prototype = {
//     constructor: UserController,
//     init () {

//     },

//     async login() {
//         UserModel.findOne({"username":"admin"}, (err,doc) => {
//             console.log(doc)
//         })
//     }
// }
class UserController {
    constructor () {
        this.init()
    }

    init () {

    }

    // 账号密码登录验证
    async login (data) {
        let result;
        // 根据用户名查询账号信息
        await UserModel.findOne({"username":data.username}, (err,doc) => {
            console.log(doc)
            console.log(typeof data.password)
            if(doc === null){
                result = {
                    msg:'用户名不存在',
                    state: 2
                }
            }else if( doc.password !== data.password) {
                result = {
                    msg:'用户名或密码错误',
                    state: 3
                }
            }else{
                result = {
                    msg: '登录成功',
                    state: 1
                }
            }
        })

        return result;
    }

    // 验证用户名能否注册
    async checkUsername (username) {
        let result;

        await new Promise( (resolve) => {
            UserModel.findOne({"username":username}, (err, doc)=>{
                if(doc === null){
                    result = {
                        state:1,
                        msg:'该用户名可以注册!'
                    }
                }else {
                    result = {
                        state: 0,
                        msg:'该用户名已经被人注册!'
                    }
                }
                resolve()
            })
        })

        return result;
    }

    // 用户注册
    async signup (data) {
        let result, state, id;

        // 检测用户名是否可以注册
        await this.checkUsername(data.username).then((ret)=>{
            console.log(ret)
            if(ret.state === 1){
                state = 1
                result = ret
            }else{
                state = 0
                result = ret
            }
        })
        
        // 用户名不可用
        if(state == 0) {
            return result;
        }
        
        // 设置用户列表id
        await new Promise( (resolve) => {
            idsModel.findOneAndUpdate({'idName':'userId'}, {$inc: {id:1}}, {new: true}, (err, doc) => {
                console.log(doc)
                if(err){
                    result = {
                        state:0,
                        msg:'操作失败'
                    }
                }else{
                    id = doc.id
                }
                
                resolve()
            })
        })
        // id更新失败
        if(state == 0) {
            return result;
        }
        
        // 用户注册
        await new Promise( (resolve) => {
            data.id = id;

            UserModel.create(data, (err)=>{
                console.log(err)
                if(err){
                    result = {
                        state:0,
                        msg:'操作失败'
                    }
                }else {
                    result = {
                        state: 1,
                        msg:'用户注册成功'
                    }
                }
                resolve()
            })
        })
         
       
        // console.log(3)
        

        return result
    }

}

module.exports = new UserController();