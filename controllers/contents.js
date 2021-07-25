const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const constants = require('../misc/constants')
const Content = require('../models/content')
const Donation = require('../models/donation')
const donations = require('./donations')
const { validPositiveInt, jwtAuthenticatedResponse } = require('./misc/util')
const sequelize = require('../db/sequelize')
const {QueryTypes} = require('sequelize')
const Package = require('../models/package')

module.exports = {
	/**
	 * Stores a content of a package if has valid donation and quantity
	 * WARNING! This method assumes institution is a valid id
	 * @param {Int} pkg package id
	 * @param {Int} donation donation id
	 * @param {Int} quantity 
	 * @returns 
	 */
	store: async (institution, pkg, donation, quantity) => {
		if (validPositiveInt(quantity) && validPositiveInt(donation)) {
			try {
				return sequelize.transaction(async (t) => {
					return Donation.findOne({ where: { id: donation } },
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
											don.donationFinished = true
										await don.save()

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

	index_by_package: async (req, res, next) => {
		await jwtAuthenticatedResponse(req, res, next, false, 
				validPositiveInt(req.body.package),
			async (err, user, info) => {
				const pkg = await Package.findByPk(req.body.package)
				if (pkg)
				{
					if(pkg.user == user.id)
					{
						const resp = await sequelize.query(
							"SELECT contents.id, donations.description, contents.quantity FROM contents \
								INNER JOIN donations ON contents.donation = donations.id \
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
				const pkg = await Package.findByPk(req.body.package)
				if (pkg)
				{
					if(pkg.institution == user.id)
					{
						const resp = await sequelize.query(
							"SELECT contents.id, donations.description, contents.quantity FROM contents \
								INNER JOIN donations ON contents.donation = donations.id \
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