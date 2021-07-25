const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const Content = require('../models/content')
const Donation = require('../models/donation')
const { validPositiveInt, jwtAuthenticatedResponse } = require('./misc/util')
const sequelize = require('../db/sequelize')
const {QueryTypes, literal} = require('sequelize')
const Package = require('../models/package')

module.exports = {
	/**
	 * Stores a content of a package if has valid donation and quantity
	 * WARNING! This method assumes institution is a valid id
	 * @param {Int} institution institution id
	 * @param {Int} pkg package id
	 * @param {Int} donation donation id
	 * @param {Int} quantity 
	 * @returns 
	 */
	store: async (institution, pkg, donation, quantity) => {
		if (validPositiveInt(quantity) && validPositiveInt(donation)) {
			try {
				return sequelize.transaction(async (t) => {
					return Donation.findOne({ where: { id: donation }, paranoid: false },
						{transaction: t}).then(async (don) => {
							if (don) {
								if (don.user == institution) {
									// Cannot be lesser than 0
									quantity = Math.min(don.quantity, quantity)
									// Updates donation
									don.quantity = Math.max(don.quantity - quantity, 0)
									if (quantity)
									{
										if(!don.quantity)
											don.finished = true
										await don.save({paranoid: false})

										return Content.create({ package: pkg, donation, quantity },
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

	/**
	 * Gets all package contents by a given package into a query if
	 * the package owner is the user of the token
	 * @param {Request} req 
	 * @param {Response} res 
	 * @param {Middleware} next 
	 */
	index_by_package: async (req, res, next) => {
		const query = req.query
		const pkg_id = parseInt(query.id)
		await jwtAuthenticatedResponse(req, res, next, false, 
				validPositiveInt(pkg_id),
			async (err, user, info) => {
				const pkg = await Package.findByPk(pkg_id)
				if (pkg)
				{
					if(pkg.user == user.id)
					{
						const resp = await sequelize.query(
							"SELECT contents.id, donations.description, contents.quantity \
								FROM contents \
								INNER JOIN donations ON contents.donation = donations.id \
								WHERE contents.package = $1",
							{bind: [pkg_id], type: QueryTypes.SELECT})
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

	/**
	 * Gets all contents relative to package the institution package if
	 * the token is the institution token
	 * @param {Request} req 
	 * @param {Response} res 
	 * @param {Middleware} next 
	 */
	index_by_package_institution: async (req, res, next) => {
		const query = req.query
		const pkg_id = parseInt(query.id)
		await jwtAuthenticatedResponse(req, res, next, true, 
				validPositiveInt(pkg_id),
			async (err, user, info) => {
				const pkg = await Package.findByPk(pkg_id)
				if (pkg)
				{
					if(pkg.institution == user.id)
					{
						const resp = await sequelize.query(
							"SELECT contents.id, donations.description, contents.quantity FROM contents \
								INNER JOIN donations ON contents.donation = donations.id \
								WHERE contents.package = $1",
							{bind: [pkg_id], type: QueryTypes.SELECT})
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

	/**
	 * Deletes a package if the package belongs to the token user
	 * @param {Request} req 
	 * @param {Response} res 
	 * @param {Middleware} next 
	 */
	delete: async (req, res, next) => {
		const query = req.query
		const id = parseInt(query.id)
		await jwtAuthenticatedResponse(req, res, next, false, 
				validPositiveInt(id)
				, async (err, user, info) => {
					const cont = await Content.findByPk(id)
					if (cont)
					{
						const pkg = await Package.findByPk(cont.package)
						if (pkg.user == user.id)
						{
							// Increases quantity when a content is deleted
							await Donation.update(
								{
									quantity: literal(`quantity + ${cont.quantity}`),
									finished: false
								}, {where: {id: cont.donation}, paranoid: false})

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