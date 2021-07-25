const express = require('express')
const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const router = express.Router()
const {cities, states} = require('../controllers/misc/util')

const citiesArrs = {}
Object.assign(citiesArrs, cities)
Object.keys(cities).forEach(el => { citiesArrs[el] = Array.from(cities[el]) })

router.get('/cities', (req, res) => {
	const state = req.query.state
	if (states.has(state))
		return res.status(StatusCodes.OK)
			.json(citiesArrs[state])
	else
		res.status(StatusCodes.NOT_FOUND)
			.send(ReasonPhrases.NOT_FOUND)
})

module.exports = router
