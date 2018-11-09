const express = require('express')
let router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
let User = require('../models/user')
let config = require('../helpers/config')


/**
 * localhost:3000/api/session/login
 * localhost:3000/api/session/register
 */

// Register a new user on POST
router.post('/register', function(req, res, next) {

  console.log(req.body)
  let hashedPassword = bcrypt.hashSync(req.body.password, 8);

  let newUser = new User ({
    email: req.body.email,
    password: hashedPassword,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    address: req.body.address
  })

  User.create(newUser, function(err, user) {
    if (err) return res.status(500).send('There was a program registering the user.')

    let token = jwt.sign({ id: user_id}, config.web.secret, {
      expiresIn: 86400
    })

    res.status(200).send({ auth: true, token: token })
  })
})

router.post('/login', function(req, res, next) {

  let email = req.body.email

  User.findOne({'email': email }, function(err, user) {
    if (err) return res.status(500).send('Error on server')
    if (!user) return res.status(404).send('No user found')

    let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null })

    let token = jwt.sign({ id: user._id}, config.web.secret, {
      expiresIn: 86400
    })

    res.status(200).send({ auth: true, token: token})
  })
})

// Logout an existing user
exports.user_logout = function(req, res) {
  res.status(200).send({ auth: false, token: null});
};

module.exports = router