const {genSalt, hashSync} = require('bcrypt')
const User = require('../models/user')
const constants = require('../misc/constants')

module.exports = {
	/**
	 * Stores a new user into the users table
	 * @param {String[255]} username 
	 * @param {String[255]} email 
	 * @param {String} password 
	 * @param {String{2}} state
	 * @param {String{255}} city
	 * @param {String{255}} neighborhood,
	 * @param {String{255}} street,
	 * @param {String{8}} zip,
	 * @param {String{11}} phone
	 * @returns {User}
	 */
	store: async (username, email, password, cpfCnpj, isCnpj, state, 
			city, neighborhood, street, zip, phone) => {
		const salt = genSalt()
		const encrypted = hashSync(password, constants.SALT_ROUNDS)
		return await User.create({
			username, 
			email, 
			password: encrypted, 
			cpfCnpj,
			isCnpj,
			state,
			city,
			neighborhood,
			street,
			zip,
			phone
		})
	},

	/**
	 * Gets a user from the user table by its email
	 * @param {String[255]} email 
	 * @returns {User} or null
	 */
	show: async (email) => {
		return await User.findOne({where: {email}})
	},

	/**
	 * Gets a user from the user table by its id
	 * @param {Int} id 
	 * @returns {User} or null
	 */
	show_by_id: async (id) => {
		return await User.findOne({where: {id}})
	}
}