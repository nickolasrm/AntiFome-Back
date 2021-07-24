const { cpf, cnpj } = require('cpf-cnpj-validator')
const isValidCep = require('@brazilian-utils/is-valid-cep')
const isValidPhone = require('@brazilian-utils/is-valid-phone')
const {getStateCities, getAllStates, getAllCities} = require('easy-location-br')

/**
 * Returns only the numbers from a string
 * @param {String} strr 
 * @returns {String}
 */
function extractNumbersAsString(strr) {
	return strr.replace(/\D/g, '')
}

/**
 * Checks whether the text parameter is a string and if it is at least the size of min_length
 * @param {String} text 
 * @param {String} min_length default=1
 */
function validText(text, min_length=1)
{
	return typeof text == 'string' && text.length >= min_length
}

/**
 * Verifies if a request body has a valid email field
 * @param {Request Body} body 
 * @returns {Boolean}
 */
function validEmail(body) {
	const email = body.email
	if (email && typeof email == 'string') {
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
function validPassword(body) {
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
function validUsername(body) {
	const username = body.username
	if (username && typeof username == 'string'
		&& username.length >= 3) return true
	else return false
}

/*
 * Verifies if a request body has a valid cpf field
 * @param {Request Body} body 
 * @returns {Boolean}
 */
function validCNPJ(body) {
	const cnpjj = body.cnpj
	if (typeof cnpjj == 'string') {
		return cnpj.isValid(parseCPForCNPJ(cnpjj))
	}
	else
		return false
}

/*
 * Verifies if a request body has a valid cnpj field
 * @param {Request Body} body 
 * @returns {Boolean}
 */
function validCPF(body) {
	const cpff = body.cpf
	if (typeof cpff == 'string') {
		return cpf.isValid(parseCPForCNPJ(cpff))
	}
	else
		return false
}

/**
 * Parses a string containing cpf or cnpj to number only string
 * @param {String} cpforcnpj 
 * @returns {String}
 */
function parseCPForCNPJ(cpforcnpj) {
	return extractNumbersAsString(cpforcnpj)
}

/*
 * Verifies if a request body has a valid phone field
 * @param {Request Body} body 
 * @returns {Boolean}
 */
function validPhone(body) {
	return isValidPhone(body.phone)
}

/**
 * Returns a number only phone
 * @param {String} phone 
 * @returns {String}
 */
function parsePhone(phone) {
	return extractNumbersAsString(phone)
}

/**
 * Verifies if a request body has a valid zip field
 * @param {Request Body} body 
 * @returns {Boolean}
 */
function validZip(body) {
	return isValidCep(body.zip)
}

/**
 * Returns a numeber only zip
 * @param {String} zip 
 * @returns {String}
 */
function parseZip(zip) {
	return extractNumbersAsString(zip)
}

const states = new Set()
getAllStates().forEach(el => {
	states.add(el.id)
})
/**
 * Verifies if a request body has a valid state field
 * @param {Request Body} body 
 * @returns {Boolean}
 */
function validState(body) {
	if (body.state)
		return states.has(body.state)
	else
		return false
}

const cities = {}
states.forEach(el => {
	let stateCities = new Set()
	getStateCities(el).forEach(city => {
		stateCities.add(city.name)
	})
	cities[el] = stateCities
})
/** 
 * Verifies if a request body has a valid state field
 * WARNING! This method assumes the request has a valid state field
 * @param {Request Body} body 
 * @returns {Boolean}
 */
function validCity(body)
{
	const state = body.state
	if(body.city)
		return cities[state].has(body.city)
	else
		return false
}

/** 
 * Verifies if a request body has a valid neighborhood field
 * @param {Request Body} body 
 * @returns {Boolean}
 */
function validNeighborhood(body)
{
	return validText(body.neighborhood, 2)
}

/**
 * Returns a parsed neighborhood
 * @param {String} street 
 * @returns {String}
 */
function parseNeighborhood(neighborhood)
{
	return neighborhood.toUpperCase()
}

/** 
 * Verifies if a request body has a valid street field
 * @param {Request Body} body 
 * @returns {Boolean}
 */
function validStreet(body)
{
	return validText(body.street, 2)
}

/**
 * Returns a parsed street
 * @param {String} street 
 * @returns {String}
 */
function parseStreet(street)
{
	return street.toUpperCase()
}

/**
 * Checks if a request has a defined authorization header
 * @param {Request} req 
 * @returns {Boolean}
 */
function hasAuthorization(req) {
	return req.headers && req.headers.authorization
}

module.exports = {
	validEmail,
	validPassword,
	validUsername,
	validCNPJ,
	validCPF,
	parseCPForCNPJ,
	validZip,
	parseZip,
	validPhone,
	parsePhone,
	validState,
	validCity,
	validNeighborhood,
	parseNeighborhood,
	validStreet,
	parseStreet,
	extractNumbersAsString,
	hasAuthorization
}