const passport = require('passport')
const JWTStrategy = require('passport-jwt').Strategy
const {StatusCodes} = require('http-status-codes')
const createError = require('http-errors')
const jwt = require('jsonwebtoken')

const users = require('../controllers/users')

const SECRET = process.env.JWT_SECRET || 'MySuperSecretCode'
const SECONDS_UNTIL_TOKEN_EXPIRATION = 43200 //30 days

/**
 * Returns the current time in seconds
 * @returns {Int}
 */
function currentTimeInSeconds(){ return Math.round((new Date).getTime() / 1000) }

/**
 * Generates a new jwt token with expiration and the user id
 * @param {Int} id the user id
 * @returns {String}
 */
function generateToken(id)
{
	return jwt.sign({
		id,
		exp: currentTimeInSeconds() + SECONDS_UNTIL_TOKEN_EXPIRATION
	}, 
	passport.SECRET)
}

passport.use(new JWTStrategy({
	// Extracts the jwt from a request header
	jwtFromRequest: (req) => {
		if(req.headers && req.headers.authorization)
			return req.headers.authorization
		else
			return null
	},
	secretOrKey: SECRET

	// Verifies if the jwt token is valid
}, async (payload, next) => {
	const expiration = parseInt(payload.exp)
	if(currentTimeInSeconds() > expiration)
		next(createError(StatusCodes.GONE), false)
	else
	{
		const user = await users.show_by_id(payload.id)
		if(user)
			next(null, user)
		else
			next(createError(StatusCodes.NOT_FOUND), false)
	}
}))

module.exports = passport
module.exports.SECRET = SECRET
module.exports.generateToken = generateToken