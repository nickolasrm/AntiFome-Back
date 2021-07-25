const Sequelize = require('sequelize')
const config = require('../config/sequelize')
const Donation = require('../models/donation')
const Package = require('../models/package')
const User = require('../models/user')
const Content = require('../models/content')

connection = new Sequelize(config)

User.init(connection)
Donation.init(connection)
Package.init(connection)
Content.init(connection)

if (process.env.ENV != 'test')
	connection.sync()

module.exports = connection