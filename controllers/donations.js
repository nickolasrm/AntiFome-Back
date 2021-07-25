const Donation = require('../models/donation')
const passport = require('../config/passport')
const {validText, validIntInRange, jwtAuthenticatedResponse, validPositiveInt} = require('./misc/util')
const {StatusCodes, ReasonPhrases} = require('http-status-codes')
const constants = require('../misc/constants')
const Content = require('../models/content')

module.exports = {
	/**
	 * Stores a donation into the donations table if the request is valid
	 * @param {Request} req 
	 * @param {Response} res 
	 * @param {Next} next
	 */
	store: async (req, res, next) => {
		const body = req.body
		await jwtAuthenticatedResponse(req, res, next, true, 
					validText(body.description)
					&& validIntInRange(body.priority, 
						constants.DONATION_MIN_PRIORITY, 
						constants.DONATION_MAX_PRIORITY)
					&& validIntInRange(body.quantity, 1, 999999)
			, async (err, user, info) => {
				const donation = Donation.create({
					user: user.id,
					description: body.description,
					quantity: body.quantity
				})
				if (donation)
					res.status(StatusCodes.CREATED)
						.send(ReasonPhrases.CREATED)
				else
					res.status(StatusCodes.INTERNAL_SERVER_ERROR)
						.send(ReasonPhrases.INTERNAL_SERVER_ERROR)
			})
	},


	/**
	 * Returns all data relative to an user, only if it is a CNPJ
	 * @param {Request} req 
	 * @param {Response} res
	 * @param {Middleware} next 
	 */
	index: async (req, res, next) => {
		await jwtAuthenticatedResponse(req, res, next, true, true, async (err, user, info) => {
				const donations = await Donation.findAll({where: {user: user.id}})
				res.status(StatusCodes.OK).json(donations)
			})
	},

	/**
	 * Returns all donations available donations
	 * @param {Request} req 
	 * @param {Response} res 
	 * @param {Middleware} next 
	 * @returns {Donation[]}
	 */
	index_waiting_donator: async (req, res, next) => {
		const query = req.query
		const id = parseInt(query.id)
		if (validPositiveInt(id))
		{
			const donations = await Donation.findAll(
				{where: {user: id, finished: false}})
			return res.status(StatusCodes.OK)
				.json(donations)
		}
		else
			return res.status(StatusCodes.BAD_REQUEST)
				.send(ReasonPhrases.BAD_REQUEST)
	},

	/**
	 * Deletes a donation if the user is the owner
	 * @param {Request} req 
	 * @param {Response} res 
	 * @param {Next} next 
	 */
	delete: async (req, res, next) => {
		const query = req.query
		const id = parseInt(query.id)
		await jwtAuthenticatedResponse(req, res, next, true, Number.isInteger(id), 
			async (err, user, info) => {
				const don = await Donation.findOne({where: {id},
					paranoid: false})
				// Checks if a donation belongs to the user
				if (don)
				{
					if (don.user == user.id)
					{
						// No problems related to existent content because of paranoid
						await don.destroy()
						res.status(StatusCodes.OK)
							.send(StatusCodes.OK)
					}
					else
						res.status(StatusCodes.UNAUTHORIZED)
							.send(ReasonPhrases.UNAUTHORIZED)
				}
				else
					res.status(StatusCodes.NOT_FOUND)
						.send(ReasonPhrases.NOT_FOUND)
			})
	}
}