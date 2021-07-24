const Donation = require('../models/donation')
const passport = require('../config/passport')
const {validText, validIntInRange, jwtAuthenticatedResponse} = require('./misc/util')
const {StatusCodes, ReasonPhrases} = require('http-status-codes')
const constants = require('../misc/constants')

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
					quantity: body.quantity,
					status: constants.WAITING_DONATOR
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
	 * Returns a donation if the person who requested is the owner of it
	 * @param {Request} req 
	 * @param {Response} res 
	 * @param {Middleware} next 
	 */
	show: async (req, res, next) => {
		const body = req.body
		await jwtAuthenticatedResponse(req, res, next, true, Number.isInteger(body.id), 
			async (err, user, info) => {
				const donation = await Donation.findOne({where: {id: body.id}})
				if (donation)
				{
					if (donation.user == user.id)
						res.status(StatusCodes.OK)
							.json(donation)
					else
						res.status(StatusCodes.UNAUTHORIZED)
							.send(ReasonPhrases.UNAUTHORIZED)
				}
				else
					res.status(StatusCodes.NOT_FOUND)
						.send(ReasonPhrases.NOT_FOUND)
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

	index_waiting_donator: async (req, res, next) => {
		const body = req.body
		if (Number.isInteger(body.user))
		{
			const donations = await Donation.findAll({where: {
				user: body.user,
				status: constants.WAITING_DONATOR
			}})
			return res.status(StatusCodes.OK)
				.json(donations)
		}
		else
			return res.status(StatusCodes.BAD_REQUEST)
				.send(ReasonPhrases.BAD_REQUEST)
	},

	delete: async (req, res, next) => {
		const body = req.body
		await jwtAuthenticatedResponse(req, res, next, true, Number.isInteger(body.id), 
			async (err, user, info) => {
				const don = await Donation.findOne({where: {id: body.id}})
				if (don)
				{
					if (don.user == user.id)
					{
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