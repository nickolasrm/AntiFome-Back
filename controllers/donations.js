const Donation = require('../models/donation')
const passport = require('../config/passport')
const {hasAuthorization} = require('./misc/util')
const {StatusCodes, ReasonPhrases} = require('http-status-codes')

module.exports = {
	/**
	 * Stores a donation into the donations table if the request is valid
	 * @param {Request} req 
	 * @param {Response} res 
	 * @param {Next} next
	 */
	store: async (req, res, next) => {
		passport.authenticate('jwt', (err, user, info) => {
			if (hasAuthorization(req))
			{
				
			}
			else
				res.status(StatusCodes.BAD_REQUEST)
					.send(ReasonPhrases.BAD_REQUEST)
		})(req, res, next)
	},

	/**
	 * Returns all data relative to a user
	 * @param {Request} req 
	 * @param {Response} res 
	 */
	index: async (req, res) => {

	},

	update: async (req, res) => {

	},

	delete: async (req, res) => {

	}
}