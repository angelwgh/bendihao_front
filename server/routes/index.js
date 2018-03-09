const express = require('express');
const router = express.Router();
// const db = require('../modules/db')

const admin = require('./admin')
const front = require('./front')

const users = require('./users')
const demos = require('./demos')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('ajax')
});

router.use('/userController', users)
router.use('/admin', admin)
router.use('/front', front)
router.use('/demosController', demos)

module.exports = router;
