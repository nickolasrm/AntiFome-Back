const {StatusCodes, ReasonPhrases} = require('http-status-codes')
const users = require('./users')
const {validEmail, validUsername, validPassword, validCNPJ, 
		validCPF, parseCPForCPF} = require('./misc/util')

module.exports = {
	/**
	 * Registers a new user if it doesn't conflict with another
	 * @param {Request} req 
	 * @param {Response} res 
	 * @returns {Response}
	 */
	register: async (req, res) => {
		const body = req.body
		if (validEmail(body) && validPassword(body) && validUsername(body))
		{
			let cpfCnpj = undefined
			if (validCPF(body))
				cpfCnpj = body.cpf
			else if(validCNPJ(body))
				cpfCnpj = body.cnpj

			if (cpfCnpj)
			{
				const email = body.email
				if (await users.show(email) == null)
				{
					const user = users.store(body.username, email, 
						body.password, parseCPForCPF(cpfCnpj))
					if (user)
						return res.status(StatusCodes.CREATED)
							.send(ReasonPhrases.CREATED)
					else
						return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
							.send(ReasonPhrases.INTERNAL_SERVER_ERROR)
				}
				else
					return res.status(StatusCodes.CONFLICT)
						.send(ReasonPhrases.CONFLICT)
			}
		}
		return res.status(StatusCodes.BAD_REQUEST)
			.send(ReasonPhrases.BAD_REQUEST)
	}
}