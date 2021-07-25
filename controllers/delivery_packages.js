const passport = require('../config/passport')
const {jwtAuthenticatedResponse, 
		validPositiveInt} = require('./misc/util')
const {StatusCodes, ReasonPhrases} = require('http-status-codes')
const Package = require('../models/package')
const Content = require('../models/content')
const sequelize = require('../db/sequelize')
const DeliveryPackage = require('../models/delivery_package')
const DeliveryContent = require('../models/delivery_content')

module.exports = {
	/**
	 * Stores a delivery package into the delivery_packages table if a request is valid
	 * @param {Request} req 
	 * @param {Response} res 
	 * @param {Next} next
	 */
	store: async (req, res, next) => {
		const body = req.body
		const pkg_id = body.package
		await jwtAuthenticatedResponse(req, res, next, false, 
				validPositiveInt(pkg_id)
				, async (err, user, info) => {
			const pkg = await Package.findOne({where: {id: pkg_id}})
			if (pkg)
			{
				//Array with added contents
				let addedContent = []

				//Creates a delivery_pkg
				const dpkg = await DeliveryPackage.create({
					user: user.id, 
					package: institution_id,
					finished: false
				})

				//For each content
				for(var el of body.content){
					const content = await dContents.store(user.id, dpkg.id,
						el.id, el.quantity)
					if (content instanceof DeliveryContent)
						addedContent.push(content)
				}

				if(addedContent.length)
					return res.status(StatusCodes.CREATED)
						.json({id: pkg.id, contents: addedContent})
				else
				{
					await dpkg.destroy()
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
	 * Return all delivery packages relative to the token user
	 * @param {Request} req 
	 * @param {Response} res
	 * @param {Middleware} next 
	 */
	index: async (req, res, next) => {
		await jwtAuthenticatedResponse(req, res, next, false, true, async (err, user, info) => {
				res.status(StatusCodes.OK)
					.json(await DeliveryPackage.findAll({where: {user: user.id},
						attributes: ['id', 'package', 'finished']}))
			})
	},

	/**
	 * Returns all delivery packages relative to the token if the token is the 
	 * package owner token
	 * @param {Request} req 
	 * @param {Response} res 
	 * @param {Middleware} next 
	 */
	index_institution: async (req, res, next) => {
		await jwtAuthenticatedResponse(req, res, next, true, true, async (err, user, info) => {
			//delivery_packages INNER JOIN pkg.id = dpkg.package WHERE pkg.user = 'user_id'
			res.status(StatusCodes.OK)
				.json(await Package.findAll({where: {institution: user.id},
						attributes: ['id', 'package', 'finished']}))
		})
	},

	/**
	 * Deletes a delivery package if the token user is the owner of a package
	 * @param {Request} req 
	 * @param {Response} res 
	 * @param {Middleware} next 
	 */
	delete: async (req, res, next) => {
		const body = req.body
		await jwtAuthenticatedResponse(req, res, next, false, 
				validPositiveInt(body.id), 
				async (err, user, info) => {
			const pkg = await DeliveryPackage.findByPk(body.id)
			if (pkg)
			{
				if (pkg.user == user.id && !pkg.finished)
				{
					const sum = await DeliveryContent.findAll({
						where: {package: pkg.id},
						attributes: [[sequelize.fn('sum', sequelize.col('quantity')), 'total'], 
							'content'],
						group: ['content']
					})
					for(let group of sum)
						await Content.increment({quantity: parseInt(group.dataValues.total)}, 
							{where: {id: group.dataValues.content}})

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