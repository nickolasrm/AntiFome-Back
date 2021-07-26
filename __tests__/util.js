/**
 * Generates a template user
 * @param {Object} args
 * @param {String} args.email
 * @param {String} args.password
 * @param {String} args.email
 * @param {String} args.state
 * @param {String} args.city
 * @param {String} args.street
 * @param {String} args.zip
 * @param {String} args.phone
 * @param {String} args.neighborhood
 * @returns {User}
 */
function generateUser(args)
{
	if (!args)
		args = {}
		
	let user = {
		username: args.username || 'Test',
		password: args.password || '12345678',
		email: args.email || 'test@test.com',
		state: args.state || 'RJ',
		city: args.city || 'Rio de Janeiro',
		neighborhood: args.neighborhood || 'Realengo',
		street: args.street || 'Visconde Pinheiredo 930',
		zip: args.zip || '26270280',
		phone: args.phone || '(21) 99999-9999'
	}
	if (args.cpf)
		user.cpf = args.cpf
	else
		user.cnpj = args.cnpj || '26982778000137'
	return user
}

function generateDonation(args)
{
	if (!args)
		args = {}
		
	return {
		description: args.description || 'Carne vermelha',
		quantity: args.quantity || 5,
		priority: args.priority || 2
	}
}

function generatePackage(args)
{
	if (!args) args = {}
	return {
		institution: args.institution || 1, 
		content: [
			{id: args.cid1 || 1 , quantity: args.qid1 || 3},
			{id: args.cid2 || 2, quantity: args.qid2 || 2}
		]
	}
}

module.exports = {
	generateUser,
	generateDonation,
	generatePackage
}