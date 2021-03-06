const User = require('../models/user')
const { validState, validCity } = require('./misc/util')
const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const { Op, literal, QueryTypes } = require('sequelize')
const sequelize = require('../db/sequelize')

const STATE_SELECT_QUERY = 'SELECT id, username, state, city, neighborhood, \
		street, "cpfCnpj", phone, zip FROM users \
		WHERE EXISTS (SELECT 1 FROM donations WHERE donations.user = users.id)  \
		AND users.state = $$1 AND users."isCnpj" = true'

module.exports = {
	/**
	 * Returns all institutions by its state and city, if specified, 
	 * that have at least one donation
	 * @param {Request} req 
	 * @param {Response} res 
	 * @param {Middleware} next 
	 */
	index: async (req, res, next) => {
		const query = req.query
		if(validState(query))
		{
			let insts
			if (validCity(query))
				insts = await sequelize.query(STATE_SELECT_QUERY + ' AND users.city = $$2',
					{bind: [query.state, query.city], type: QueryTypes.SELECT})
			else
				insts = await sequelize.query(STATE_SELECT_QUERY,
					{bind: [query.state], type: QueryTypes.SELECT})

			res.status(StatusCodes.OK)
				.json(insts)
		}
		else
			res.status(StatusCodes.BAD_REQUEST)
				.send(ReasonPhrases.BAD_REQUEST)
	}
}