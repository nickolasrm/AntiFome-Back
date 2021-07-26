process.env.ENV = 'test'

const request = require('supertest')
const { StatusCodes } = require('http-status-codes')
const app = require('../app')
const {generateUser, generateDonation} = require('./util')

var institutionToken, userToken

describe('Institutions', () => {
	beforeAll(async () => {
		await app.db.sync({ force: true })

		let user = generateUser()
		let res = await request(app)
			.post('/register')
			.set('Content-Type', 'application/json')
			.send(user)
		res = await request(app)
			.post('/login')
			.set('Content-Type', 'application/json')
			.send({email: user.email, password: user.password})
		institutionToken = res.body.token

		user = generateUser({email: "test1@gmail.com", cpf: "256.344.287-77"})
		res = await request(app)
			.post('/register')
			.set('Content-Type', 'application/json')
			.send(user)
		res = await request(app)
			.post('/login')
			.set('Content-Type', 'application/json')
			.send({email: user.email, password: user.password})
		userToken = res.body.token
	})

	it('No state specified', async () => {
		const res = await request(app)
			.get('/institutions')
			.query()
			.send()
		expect(res.status).toBe(StatusCodes.BAD_REQUEST)
	})

	it('No institution', async () => {
		const res = await request(app)
			.get('/institutions')
			.query({state: 'RJ'})
			.send()
		expect(res.body.length).toBe(0)
	})

	it('One institution', async () => {
		let res = await request(app)
			.post('/donations')
			.set('Authorization', institutionToken)
			.set('Content-Type', 'application/json')
			.send(generateDonation())

		res = await request(app)
			.get('/institutions')
			.query({state: 'RJ'})
			.send()
		expect(res.body.length).toBe(1)
	})

	it('City with no institution', async () => {
		const res = await request(app)
			.get('/institutions')
			.query({state: 'RJ', city: 'Teresópolis'})
			.send()
		expect(res.body.length).toBe(0)
	})

	it('City with institution', async () => {
		const res = await request(app)
			.get('/institutions')
			.query({state: 'RJ', city: 'Rio de Janeiro'})
			.send()
		expect(res.body.length).toBe(1)
	})

	it('State with no institution', async () => {
		const res = await request(app)
			.get('/institutions')
			.query({state: 'SP'})
			.send()
		expect(res.body.length).toBe(0)
	})

	afterAll(async () => {
		await app.close()
		await app.db.close()
	})
})