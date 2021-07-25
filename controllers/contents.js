const { StatusCodes, ReasonPhrases, RESET_CONTENT } = require('http-status-codes')
const constants = require('../misc/constants')
const Content = require('../models/content')
const Donation = require('../models/donation')
const donations = require('./donations')
const { validPositiveInt } = require('./misc/util')

module.exports = {
	/**
	 * Stores a content of a package if has valid donation and quantity
	 * WARNING! This method assumes institution is a valid id
	 * @param {Int} package package id
	 * @param {Int} donation donation id
	 * @param {Int} quantity 
	 * @returns 
	 */
	store: async (institution, package, donation, quantity) => {
		if (validPositiveInt(quantity) && validPositiveInt(donation)) {
			try {
				const content = await sequelize.transaction(async (t) => {
					const don = await Donation.findOne({ where: { id: donation } })
					if (don) {
						if (don.user == institution) {
							// Cannot be lesser than 0
							quantity = min(don.quantity, quantity)

							// Updates donation
							don.quantity = Math.max(don.quantity - quantity, 0)
							if (!don.quantity)
								don.donationFinished = true
							await don.save()

							return Content.create({ package, donation, quantity })
						}
						else
							return StatusCodes.UNAUTHORIZED
					}
					else
						return StatusCodes.NOT_FOUND
				})
				return content
			} catch (error) {
				return StatusCodes.INTERNAL_SERVER_ERROR
			}
		}
		else
			return StatusCodes.BAD_REQUEST
	},

	index_by_package: async (req, res, next) => {
		
	},

	delete: async (req, res, next) => {

	}
}