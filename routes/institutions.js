const express = require('express')
const router = express.Router()
const institutions = require('../controllers/institutions')

router.get('/institutions', institutions.index)

module.exports = router
