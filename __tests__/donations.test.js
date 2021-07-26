process.env.ENV = 'test'

const request = require('supertest')
const { StatusCodes } = require('http-status-codes')
const app = require('../app')
const {generateUser, generateDonation} = require('./util')

var institutionToken, userToken

describe('Donations', () => {
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

	describe('Storing', () => {
		it('No headers', async () => {
			const res = await request(app)
				.post('/donations')
				.send()
			expect(res.status).toBe(StatusCodes.BAD_REQUEST)
		})

		it('With wrong token', async () => {
			const res = await request(app)
				.post('/donations')
				.set('Authorization', 'Wrong token')
				.send()
			expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
		})

		it('With wrong body', async () => {
			const res = await request(app)
				.post('/donations')
				.set('Authorization', institutionToken)
				.set('Content-Type', 'application/json')
				.send({})
			expect(res.status).toBe(StatusCodes.BAD_REQUEST)
		})

		it('With CPF', async () => {
			const res = await request(app)
				.post('/donations')
				.set('Authorization', userToken)
				.set('Content-Type', 'application/json')
				.send(generateDonation())
			expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
		})

		it('Right storing', async () => {
			const res = await request(app)
				.post('/donations')
				.set('Authorization', institutionToken)
				.set('Content-Type', 'application/json')
				.send(generateDonation())
			expect(res.status).toBe(StatusCodes.CREATED)
		})
	})

	describe('Index', () => {
		it('No headers', async () => {
			const res = await request(app)
				.get('/donations/all')
				.send()
			expect(res.status).toBe(StatusCodes.BAD_REQUEST)
		})

		it('With wrong token', async () => {
			const res = await request(app)
				.get('/donations/all')
				.set('Authorization', 'Wrong token')
				.send()
			expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
		})

		it('Invalid user', async () => {
			const res = await request(app)
				.get('/donations/all')
				.set('Authorization', userToken)
				.send()
			expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
		})

		it('Right index', async () => {
			const res = await request(app)
				.get('/donations/all')
				.set('Authorization', institutionToken)
				.send()
			expect(res.status).toBe(StatusCodes.OK)
			const don = generateDonation()
			expect(res.body[0].description).toBe(don.description)
		})
	})

	describe('Waiting donator index', () => {
		it('No headers', async () => {
			const res = await request(app)
				.get('/donations/waiting_donator')
				.send()
			expect(res.status).toBe(StatusCodes.BAD_REQUEST)
		})

		it('Invalid user', async () => {
			const res = await request(app)
				.get('/donations/waiting_donator')
				.query({id: 2}) // <- cpf person
				.send()
			expect(res.status).toBe(StatusCodes.OK)
		})

		it('Right index', async () => {
			const res = await request(app)
				.get('/donations/waiting_donator')
				.query({id: 1})
				.send() // <- institution
			expect(res.status).toBe(StatusCodes.OK)
			const don = generateDonation()
			expect(res.body[0].description).toBe(don.description)
		})

		// WARNING: Missing test with different status
	})

	describe('Delete', () => {
		it('No headers', async () => {
			const res = await request(app)
				.delete('/donations')
				.send()
			expect(res.status).toBe(StatusCodes.BAD_REQUEST)
		})

		it('With wrong token', async () => {
			const res = await request(app)
				.delete('/donations')
				.set('Authorization', 'Wrong token')
				.send()
			expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
		})

		it('With wrong body', async () => {
			const res = await request(app)
				.delete('/donations')
				.set('Authorization', institutionToken)
				.set('Content-Type', 'application/json')
				.send({})
			expect(res.status).toBe(StatusCodes.BAD_REQUEST)
		})

		it('With CPF', async () => {
			const res = await request(app)
				.delete('/donations')
				.set('Authorization', userToken)
				.set('Content-Type', 'application/json')
				.send({id: 1})
			expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
		})

		it('Invalid donation id', async () => {
			const res = await request(app)
				.delete('/donations')
				.set('Authorization', institutionToken)
				.set('Content-Type', 'application/json')
				.query({id: 10})
			expect(res.status).toBe(StatusCodes.NOT_FOUND)
		})

		it('Right delete', async () => {
			const res = await request(app)
				.delete('/donations')
				.set('Authorization', institutionToken)
				.set('Content-Type', 'application/json')
				.query({id: 1})
				.send()
			expect(res.status).toBe(StatusCodes.OK)
		})
	})

	afterAll(async () => {
		await app.close()
		await app.db.close()
	})
})