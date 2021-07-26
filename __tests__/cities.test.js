process.env.ENV = 'test'

const request = require('supertest')
const { StatusCodes } = require('http-status-codes')
const app = require('../app')

describe('Registering', () => {
	beforeAll(async () => {
		await app.db.sync({ force: true })
	})

	it('Inexistent state', async () => {
		const res = await request(app)
			.get('/cities')
			.query({state: 'UU'})
		expect(res.status).toBe(StatusCodes.NOT_FOUND)
	})

	it('Right request', async () => {
		const res = await request(app)
			.get('/cities')
			.query({state: 'RJ'})
		expect(res.status).toBe(StatusCodes.OK)
		expect(res.body.length).toBe(92)
	})

	afterAll(async () => {
		await app.close()
		await app.db.close()
	})
})