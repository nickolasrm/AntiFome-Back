const {StatusCodes} = require('http-status-codes')

module.exports = (app) => {
	// catch 404 and forward to error handler
	app.use(function (req, res, next) {
		next(createError(StatusCodes.NOT_FOUND))
	})

	// error handler
	app.use(function (err, req, res, next) {
		// set locals, only providing error in development
		res.locals.message = err.message
		res.locals.error = req.app.get('env') === 'development' ? err : {}

		// render the error page
		res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR)
		res.render('index')
	})
}