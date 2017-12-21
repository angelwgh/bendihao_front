const express = require('express');
const router = express.Router();
const db = require('../modules/db')

const admin = require('./admin')
const front = require('./front')

const users = require('./users')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('ajax')
});

router.use('/userController', users)
router.use('/admin', admin)
router.use('/front', front)

module.exports = router;
