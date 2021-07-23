const express = require('express')
const passport = require('../config/passport')
const router = express.Router()
const path = require('path')
const constants = require('../misc/constants')

router.get('/', (req, res) => {
    res.render('app')    
})

module.exports = router
