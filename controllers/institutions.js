const {genSalt, hashSync} = require('bcrypt')
const User = require('../models/user')
const constants = require('../misc/constants')
const { validState, validCity } = require('./misc/util')
const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const Donation = require('../models/donation')

module.exports = {
	/**
	 * Returns all institutions by its state that has at least one donation
	 * @param {Request} req 
	 * @param {Response} res 
	 * @param {Middleware} next 
	 */
	index_by_state: async (req, res, next) => {
		const body = req.body
		if (validState(body.state))
		{
			const insts = await User.findAll({
				where: {state: body.state, isCnpj: true},
				include: [{
					model: Donation
				}]
			})
			res.status(StatusCodes.OK)
				.json(insts)
		}
		else
			res.status(StatusCodes.BAD_REQUEST)
				.send(ReasonPhrases.BAD_REQUEST)
	},

	index_by_city: async (req, res, next) => {
		const body = req.body
		if(validState(body.state) && validCity(body.city))
		{
			const insts = await User.findAll({
				where: {state: body.state, city: body.city, isCnpj: true},
				include: [{
					model: Donation
				}]
			})
			res.status(StatusCodes.OK)
				.json(insts)
		}
		else
			res.status(StatusCodes.BAD_REQUEST)
				.send(ReasonPhrases.BAD_REQUEST)
	}
}