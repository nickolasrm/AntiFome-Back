const express = require('express')
const {login, logout} = require('../controllers/login')
const passport = require('../config/passport')

const router = express.Router()

router.post('/login', login)

module.exports = router