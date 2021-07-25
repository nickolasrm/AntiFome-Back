const passport = require('../config/passport')
const {jwtAuthenticatedResponse, 
		validPositiveInt,
		validCNPJ} = require('./misc/util')
const {StatusCodes, ReasonPhrases} = require('http-status-codes')
const constants = require('../misc/constants')
const User = require('../models/user')
const Package = require('../models/package')
const Content = require('../models/content')
const contents = require('./contents')
const { package_contents, delete_content } = require('./contents')
const Donation = require('../models/donation')
const sequelize = require('../db/sequelize')

module.exports = {
	/**
	 * Stores a package into the packages table if a request is valid
	 * @param {Request} req 
	 * @param {Response} res 
	 * @param {Next} next
	 */
	store: async (req, res, next) => {
		const body = req.body
		const institution_id = body.institution
		// WARNING, INSTITUTION NOT VERIFIED
		await jwtAuthenticatedResponse(req, res, next, false, 
				validPositiveInt(institution_id)
				, async (err, user, info) => {
			const institution = await User.findOne({where: {id: institution_id}})
			if (institution && institution.isCnpj)
			{
				//Array with added contents
				let addedContent = []

				//Creates a pkg
				const pkg = await Package.create({
					user: user.id, 
					institution: institution_id,
					finished: false
				})

				//For each content
				for(var el of body.content){
					const content = await contents.store(institution_id, pkg.id, 
						el.id, el.quantity)
					if (content instanceof Content)
						addedContent.push(content)
				}

				if(addedContent.length)
					return res.status(StatusCodes.CREATED)
						.json({id: pkg.id, contents: addedContent})
				else
				{
					await pkg.destroy()
					return res.status(StatusCodes.BAD_REQUEST)
						.send(ReasonPhrases.BAD_REQUEST)
				}
			}
			else
				res.status(StatusCodes.NOT_FOUND)
					.send(ReasonPhrases.NOT_FOUND)
		})
	},

	/**
	 * Return all packages relative to the token user
	 * @param {Request} req 
	 * @param {Response} res
	 * @param {Middleware} next 
	 */
	index: async (req, res, next) => {
		await jwtAuthenticatedResponse(req, res, next, false, true, async (err, user, info) => {
				res.status(StatusCodes.OK)
					.json(await Package.findAll({where: {user: user.id}}))
			})
	},

	/**
	 * Returns all packages relative to the token if the token is a institution token
	 * @param {Request} req 
	 * @param {Response} res 
	 * @param {Middleware} next 
	 */
	index_institution: async (req, res, next) => {
		await jwtAuthenticatedResponse(req, res, next, true, true, async (err, user, info) => {
			res.status(StatusCodes.OK)
				.json(await Package.findAll({where: {institution: user.id}}))
		})
	},

	/**
	 * Deletes a package if the token user is the owner of a package
	 * @param {Request} req 
	 * @param {Response} res 
	 * @param {Middleware} next 
	 */
	delete: async (req, res, next) => {
		const body = req.body
		await jwtAuthenticatedResponse(req, res, next, false, 
				validPositiveInt(body.id), 
				async (err, user, info) => {
			const pkg = await Package.findByPk(body.id)
			if (pkg)
			{
				if (pkg.user == user.id && !pkg.finished)
				{
					const sum = await Content.findAll({
						where: {package: pkg.id},
						attributes: [[sequelize.fn('sum', sequelize.col('quantity')), 'total'], 
									'donation'],
						group: ['donation']
					})
					for(let group of sum)
						await Donation.increment({quantity: parseInt(group.dataValues.total)}, 
							{where: {id: group.dataValues.donation}})

					if (await pkg.destroy())
						res.status(StatusCodes.OK)
							.send(ReasonPhrases.OK)
					else
						res.status(StatusCodes.INTERNAL_SERVER_ERROR)
							.send(ReasonPhrases.INTERNAL_SERVER_ERROR)
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