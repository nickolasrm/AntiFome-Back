const{StatusCodes, ReasonPhrases} = require('http-status-codes')
const {compareSync} = require('bcrypt')

const {validEmail, validPassword} = require('./misc/util')
const users = require('./users')
const passport = require('../config/passport')

module.exports = {
	/**
	 * Logs the user in if the request contains a valid email and password
	 * @param {Request} req 
	 * @param {Response} res 
	 * @returns {Response}
	 */
	login: async (req, res) => {
		if (req.headers && req.headers.authorization)
			return passport.authenticate('jwt', 
				{
					session: false,
					successRedirect: '/app',
				})(req, res)
		else
		{
			const body = req.body
			if (validEmail(body) && validPassword(body))
			{
				const email = body.email,
					password = body.password,
					user = await users.show(email)

				if (user)
				{
					if(compareSync(password, user.password))
					{
						return res.status(StatusCodes.OK)
							.json({token: passport.generateToken(user.id)})
					}
					else
						return res.status(StatusCodes.UNAUTHORIZED)
							.send(ReasonPhrases.UNAUTHORIZED)
				}
				else
					return res.status(StatusCodes.NOT_FOUND)
						.send(ReasonPhrases.NOT_FOUND)
			}
		}
		return res.status(StatusCodes.BAD_REQUEST)
			.send(StatusCodes.BAD_REQUEST)
	}
}