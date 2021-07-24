const express = require('express')

const donations = require('../controllers/donations')

const router = express.Router()

router.post('/donations', donations.store)
router.get('/donations/all', donations.index)
router.get('/donations/waiting_donator', donations.index_waiting_donator)
router.delete('/donations', donations.delete)
//Waiting transport on next update
router.get('/donations', donations.show)

module.exports = router
