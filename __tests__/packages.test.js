process.env.ENV = 'test'

const request = require('supertest')
const { StatusCodes } = require('http-status-codes')
const app = require('../app')
const {generateUser, generateDonation, generatePackage} = require('./util')

var institutionToken, userToken

describe('Packages', () => {
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

		res = await request(app)
			.post('/donations')
			.set('Authorization', institutionToken)
			.set('Content-Type', 'application/json')
			.send(generateDonation())

		res = await request(app)
			.post('/donations')
			.set('Authorization', institutionToken)
			.set('Content-Type', 'application/json')
			.send(generateDonation({description: 'Milho', quantity: 10, priority: 1}))
	})

	describe('Store', () => {
		it('No authorization request', async () => {
			const res = await request(app)
				.post('/packages')
				.send(generatePackage())
			expect(res.status).toBe(StatusCodes.BAD_REQUEST)
		})

		it('Package creation', async () => {
			const res = await request(app)
				.post('/packages')
				.set('Authorization', userToken)
				.send(generatePackage())
			expect(res.status).toBe(StatusCodes.CREATED)
			expect(res.body).toBe(1)
		})
	})

	describe('Package deletion', () => {
		it('Delete right', async () => {
			const res = await request(app)
				.delete('/packages')
				.set('Authorization', userToken)
				.query({id: 1})
				.send()
			expect(res.status).toBe(200)
		});
	})

	describe('Package receiving', () => {
		it('Receiving wrong token', async () => {
			let res = await request(app)
				.post('/packages')
				.set('Authorization', userToken)
				.send(generatePackage())

			res = await request(app)
				.post('/packages/receive')
				.set('Authorization', userToken)
				.send({id: 2})
			expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
		});

		it('Receiving right', async () => {
			const res = await request(app)
				.post('/packages/receive')
				.set('Authorization', institutionToken)
				.send({id: 2})
			expect(res.status).toBe(StatusCodes.OK)
		});
	})

	afterAll(async () => {
		await app.close()
		await app.db.close()
	})
})