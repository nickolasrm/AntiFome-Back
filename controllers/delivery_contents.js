const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const Content = require('../models/content')
const Donation = require('../models/donation')
const { validPositiveInt, jwtAuthenticatedResponse } = require('./misc/util')
const sequelize = require('../db/sequelize')
const {QueryTypes} = require('sequelize')
const Package = require('../models/package')

module.exports = {
	/**
	 * Stores a content of a package if has valid donation and quantity
	 * WARNING! This method assumes the package is a valid id
	 * @param {Int} package package id
	 * @param {Int} dpkg delivery package id
	 * @param {Int} content content id
	 * @param {Int} quantity 
	 * @returns 
	 */
	store: async (package, dpkg, content, quantity) => {
		if (validPositiveInt(quantity) && validPositiveInt(content)) {
			try {
				return sequelize.transaction(async (t) => {
					return Content.findOne({ where: { id: content } },
						{transaction: t}).then(async (cont) => {
							if (cont) {
								if (cont.package == package) {
									// Cannot be lesser than 0
									quantity = Math.min(cont.quantity, quantity)
									// Updates donation
									cont.quantity = Math.max(cont.quantity - quantity, 0)
									if (quantity)
									{
										if(!cont.quantity)
											cont.finished = true
										await cont.save()

										return DeliveryContent.create(
											{ package: dpkg, donation: content, quantity },
											{transaction: t})
									}
									else
										return StatusCodes.UNAUTHORIZED
								}
								else
									return StatusCodes.UNAUTHORIZED
							}
							else
								return StatusCodes.NOT_FOUND
						})
				})
			} catch (error) {
				return StatusCodes.INTERNAL_SERVER_ERROR
			}
		}
		else
			return StatusCodes.BAD_REQUEST
	},

	index_by_package: async (req, res, next) => {
		await jwtAuthenticatedResponse(req, res, next, false, 
				validPositiveInt(req.body.package),
			async (err, user, info) => {
				const pkg = await DeliveryPackage.findByPk(req.body.package)
				if (pkg)
				{
					if(pkg.user == user.id)
					{
						//unverified
						const resp = await sequelize.query(
							"SELECT delivery_contents.id, \
									donations.description, \
									delivery_contents.quantity FROM contents \
								INNER JOIN contents ON contents.id = delivery_contents.id \
								INNER JOIN delivery ON contents.donation = donation.id \
								WHERE contents.package = $1",
							{bind: [req.body.package], type: QueryTypes.SELECT})
						res.status(StatusCodes.OK)
							.json(await resp)
					}
					else
						res.status(StatusCodes.UNAUTHORIZED)
							.send(ReasonPhrases.UNAUTHORIZED)
				}
				else
					res.status(StatusCodes.NOT_FOUND)
						.send(ReasonPhrases.NOT_FOUND)
			})
	},

	index_by_package_institution: async (req, res, next) => {
		await jwtAuthenticatedResponse(req, res, next, true, 
				validPositiveInt(req.body.package),
			async (err, user, info) => {
				const dpkg = await DeliveryPackage.findByPk(req.body.package)
				if (dpkg)
				{
					const pkg = await Package.findByPk(dpkg.package)
					if(pkg.user == user.id)
					{
						const resp = await sequelize.query(
							"SELECT delivery_contents.id, \
									donations.description, \
									delivery_contents.quantity FROM contents \
								INNER JOIN contents ON contents.id = delivery_contents.id \
								INNER JOIN delivery ON contents.donation = donation.id \
								WHERE contents.package = $1",
							{bind: [req.body.package], type: QueryTypes.SELECT})
						res.status(StatusCodes.OK)
							.json(await resp)
					}
					else
						res.status(StatusCodes.UNAUTHORIZED)
							.send(ReasonPhrases.UNAUTHORIZED)
				}
				else
					res.status(StatusCodes.NOT_FOUND)
						.send(ReasonPhrases.NOT_FOUND)
			})
	},

	delete: async (req, res, next) => {
		await jwtAuthenticatedResponse(req, res, next, false, 
				validPositiveInt(req.body.id)
				, async (err, user, info) => {
					const cont = await Content.findByPk(req.body.id)
					if (cont)
					{
						const pkg = await Package.findByPk(cont.package)
						if (pkg.user == user.id)
						{
							await Donation.increment({quantity: cont.quantity}, 
								{where: {id: cont.donation}})
							res.status(StatusCodes.OK)
								.send(await cont.destroy())
							if (!(await Content.count({where: {package: pkg.id}})))
								pkg.destroy()
						}
						else
							res.status(StatusCodes.UNAUTHORIZED)
								.send(ReasonPhrases.UNAUTHORIZED)
					}
					else
						res.status(StatusCodes.NOT_FOUND)
							.send(ReasonPhrases.NOT_FOUND)
				})
	},
}