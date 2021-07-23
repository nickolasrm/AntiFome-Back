require('dotenv').config()

const db = require('./db/sequelize')

const express = require('express')
const createError = require('http-errors')

const errorHandler = require('./config/error_handler')
const constants = require('./misc/constants')

const port = 3000

const indexRouter = require('./routes/index')
const loginRouter = require('./routes/login')
const registerRouter = require('./routes/register')
const accountRouter = require('./routes/account')

const app = express()

//Default engine
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

//Parsing json
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//Static files
app.use(express.static(constants.PUBLIC_PATH))

//Routes
app.use(indexRouter)
app.use(loginRouter)
app.use(registerRouter)
app.use(accountRouter)

//Error handler
errorHandler(app)

module.exports = app.listen(port, () => {
	if (process.env.ENV != 'test')
		console.log(`Listening on ${port}`)
})
module.exports.db = db
