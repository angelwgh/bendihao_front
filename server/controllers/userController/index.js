var UserModel = require('../../modules/db/user-model')
var idCount = require('../../modules/db/ids')

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

    // 账号密码验证
    async login (data) {
        let result;
        // 根据用户名查询账号信息
        await UserModel.findOne({"username":data.username}, (err,doc) => {
            console.log(doc)
            console.log(typeof data.password)
            if(doc === null){
                result = {
                    msg:'用户名不存在',
                    status: 2
                }
            }else if( doc.password !== data.password) {
                result = {
                    msg:'用户名或密码错误',
                    status: 3
                }
            }else{
                result = {
                    msg: '登录成功',
                    status: 1
                }
            }
        })

        return result;
    }

}

module.exports = new UserController();