const Sequelize = require('sequelize')
const config = require('../config/sequelize')
const Donation = require('../models/donation')
const Package = require('../models/package')
const User = require('../models/user')
const Content = require('../models/content')
const DeliveryPackage = require('../models/delivery_package')
const DeliveryContent = require('../models/delivery_content')

connection = new Sequelize(config)

User.init(connection)
Donation.init(connection)
Package.init(connection)
Content.init(connection)
DeliveryPackage.init(connection)
DeliveryContent.init(connection)

if (process.env.ENV != 'test')
	connection.sync()

module.exports = connection