const Sequelize = require('sequelize')
const config = require('../config/sequelize')
const Donation = require('../models/donation')
const User = require('../models/user')

connection = new Sequelize(config)

User.init(connection)
Donation.init(connection)

if (process.env.ENV != 'test')
	connection.sync()

module.exports = connection