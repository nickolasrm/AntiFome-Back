const express = require('express')
const {StatusCodes, ReasonPhrases} = require('http-status-codes')

const passport = require('../config/passport')

const router = express.Router()

router.get('/account', (req, res, next) => {
	passport.authenticate('jwt', (err, user, next) => {
		if (req.headers && req.headers.authorization)
		{
			if (user)
				return res.status(StatusCodes.OK).json({
					username: user.username,
					email: user.email,
					cpfCnpj: user.cpfCnpj
				})
			else
				return res.status(StatusCodes.UNAUTHORIZED)
					.send(ReasonPhrases.UNAUTHORIZED)
		}
		else
			return res.status(StatusCodes.BAD_REQUEST)
				.send(ReasonPhrases.BAD_REQUEST)
	})(req, res, next)
})

module.exports = router