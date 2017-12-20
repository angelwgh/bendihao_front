const express = require('express');
const router = express.Router();
const db = require('../modules/db')

const admin = require('./admin')
const front = require('./front')

var user = require('./users.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('ajax')
});

router.use('/users', user)
router.use('/admin', admin)
router.use('/front', front)

module.exports = router;
