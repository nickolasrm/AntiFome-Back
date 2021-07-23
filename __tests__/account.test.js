process.env.ENV = 'test'

const request = require('supertest')
const { StatusCodes } = require('http-status-codes')
const app = require('../app')

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
		const email = 'test@test.com'
		const password = '12345678'
		const username = 'Test'
		const cpf = '25634428777'

		let res = await request(app)
			.post('/register')
			.set('Content-Type', 'application/json')
			.send({
				username,
				password,
				cpf,
				email
			})

		res = await request(app)
			.post('/login')
			.set('Content-Type', 'application/json')
			.send({email, password})
			
		res = await request(app)
			.get('/account')
			.set('Content-Type', 'application/json')
			.set('Authorization', res.body.token)
			.send()
		expect(res.status).toBe(StatusCodes.OK)
		expect(res.body.username).toBe(username)
		expect(res.body.email).toBe(email)
		expect(res.body.cpfCnpj).toBe(cpf)
	})

	afterAll(async () => {
		await app.close()
		await app.db.close()
	})
})