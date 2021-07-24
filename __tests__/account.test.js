process.env.ENV = 'test'

const request = require('supertest')
const { StatusCodes } = require('http-status-codes')
const app = require('../app')
const {generateUser} = require('./util')

describe('Account', () => {
	beforeAll(async () => {
		await app.db.sync({ force: true })
	})

	it('Getting account with no headers', async () => {
		const res = await request(app)
			.get('/account')
			.send()
		expect(res.status).toBe(StatusCodes.BAD_REQUEST)
	})

	it('Getting account with wrong token', async () => {
		const res = await request(app)
			.get('/account')
			.set('Authorization', 'Wrong token')
			.send()
		expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
	})

	it('Right request', async () => {
		const user = generateUser()

		let res = await request(app)
			.post('/register')
			.set('Content-Type', 'application/json')
			.send(user)

		res = await request(app)
			.post('/login')
			.set('Content-Type', 'application/json')
			.send({email: user.email, password: user.password})
			
		res = await request(app)
			.get('/account')
			.set('Content-Type', 'application/json')
			.set('Authorization', res.body.token)
			.send()

		delete user['password']
		expect(res.status).toBe(StatusCodes.OK)
		expect(res.body.email).toBe(user.email)
		expect(res.body.username).toBe(user.username)
		expect(res.body.password).toBeUndefined()
	})

	afterAll(async () => {
		await app.close()
		await app.db.close()
	})
})