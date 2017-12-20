var express = require("express")

var router = express.Router()

router.get('/' ,(req, res, net) => {
    res.send('管理员')
})

module.exports = router