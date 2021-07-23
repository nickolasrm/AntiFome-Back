const Sequelize = require('sequelize')
const config = require('../config/sequelize')
const User = require('../models/user')

connection = new Sequelize(config)

User.init(connection)

if (process.env.ENV != 'test')
	connection.sync()

module.exports = connection