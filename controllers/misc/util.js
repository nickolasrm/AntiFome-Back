const {cpf, cnpj} = require('cpf-cnpj-validator')

/**
 * Verifies if a request body has a valid email field
 * @param {Request Body} body 
 * @returns {Boolean}
 */
function validEmail(body)
{
	const email = body.email
	if (email && typeof email == 'string')
	{
		const split = email.split('@')
		if (split.length == 2 && split[0].length > 0
			&& split[1].length > 0) 
			return true
	}
	return false
}

/**
 * Verifies if a request body has a valid password field
 * @param {Request Body} body 
 * @returns {Boolean}
 */
function validPassword(body)
{
	const password = body.password
	if (password && typeof password == 'string'
		&& password.length >= 8) return true
	else return false
}

/*
 * Verifies if a request body has a valid username field
 * @param {Request Body} body 
 * @returns {Boolean}
 */
function validUsername(body)
{
	const username = body.username
	if (username && typeof username == 'string'
		&& username.length >= 3) return true
	else return false
}

/**
 * Returns only the numbers from a string
 * @param {String} strr 
 * @returns {String}
 */
function extractNumbersAsString(strr)
{
	return strr.replace(/\D/g, '')
}

/**
 * Parses a string containing cpf or cnpj to number only string
 * @param {String} cpforcnpj 
 * @returns {String}
 */
function parseCPForCPF(cpforcnpj)
{
	return extractNumbersAsString(cpforcnpj)
}

/*
 * Verifies if a request body has a valid cpf field
 * @param {Request Body} body 
 * @returns {Boolean}
 */
function validCNPJ(body)
{
	const cnpjj = body.cnpj
	if (typeof cnpjj == 'string')
	{
		return cnpj.isValid(parseCPForCPF(cnpjj))
	}
	else
		return false
}

/*
 * Verifies if a request body has a valid cnpj field
 * @param {Request Body} body 
 * @returns {Boolean}
 */
function validCPF(body)
{
	const cpff = body.cpf
	if (typeof cpff == 'string')
	{
		return cpf.isValid(parseCPForCPF(cpff))
	}
	else
		return false
}

module.exports = {
	validEmail,
	validPassword,
	validUsername,
	validCNPJ,
	validCPF,
	parseCPForCPF,
	extractNumbersAsString
}