var express = require("express")

var router = express.Router()

router.get('/', (req, res, next) => {
    res.send('管理员登录')
})

module.exports = router