require('dotenv').config()

const db = require('./db/sequelize')

const express = require('express')
const createError = require('http-errors')
const http = require('http')
const cors = require('cors')

const errorHandler = require('./config/error_handler')
const constants = require('./misc/constants')

const port = 80 // <- http port

const indexRouter = require('./routes/index')
const loginRouter = require('./routes/login')
const registerRouter = require('./routes/register')
const accountRouter = require('./routes/account')
const donationsRouter = require('./routes/donations')
const packagesRouter = require('./routes/packages')

const app = express()

//Enabling cors
app.use(cors())

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
app.use(donationsRouter)
app.use(packagesRouter)

app.get('/conc', async (req, res) => {
  console.log('got request');

  await new Promise(resolve => setTimeout(resolve, 10000));

  console.log('done');
  res.send('Hello World!');
});

//Error handler
errorHandler(app)

//Http server
module.exports = http.createServer(app).listen(port)
module.exports.db = db