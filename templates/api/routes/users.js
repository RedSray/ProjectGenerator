const express = require('express');
const router = express.Router();

const User = require('../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  User.find({}, function (err, users) {
    if(err) throw err;
    res.send(users);
  });
});

module.exports = router;
