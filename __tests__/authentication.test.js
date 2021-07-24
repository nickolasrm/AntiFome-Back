process.env.ENV = 'test'

const request = require('supertest')
const { StatusCodes } = require('http-status-codes')
const app = require('../app')
const {generateUser} = require('./util')

describe('Registering', () => {
	beforeAll(async () => {
		await app.db.sync({ force: true })
	})

	it('Register with no headers', async () => {
		const res = await request(app)
			.post('/register')
			.send()
		expect(res.status).toBe(StatusCodes.BAD_REQUEST)
	})

	it('Register with no headers', async () => {
		const res = await request(app)
			.post('/register')
			.send()
		expect(res.status).toBe(StatusCodes.BAD_REQUEST)
	})

	it('Register with no body', async () => {
		const res = await request(app)
			.post('/register')
			.set('Content-Type', 'application/json')
			.send()
		expect(res.status).toBe(StatusCodes.BAD_REQUEST)
	})

	it('Request with invalid email', async () => {
		const res = await request(app)
			.post('/register')
			.set('Content-Type', 'application/json')
			.send(generateUser({email: '@'}))
		expect(res.status).toBe(StatusCodes.BAD_REQUEST)
	})

	it('Request with invalid username', async () => {
		const res = await request(app)
			.post('/register')
			.set('Content-Type', 'application/json')
			.send(generateUser({username: 'AB'}))
		expect(res.status).toBe(StatusCodes.BAD_REQUEST)
	})

	it('Request with invalid password', async () => {
		const res = await request(app)
			.post('/register')
			.set('Content-Type', 'application/json')
			.send(generateUser({password: '1234567'}))
		expect(res.status).toBe(StatusCodes.BAD_REQUEST)
	})

	it('Request with invalid cpf', async () => {
		const res = await request(app)
			.post('/register')
			.set('Content-Type', 'application/json')
			.send(generateUser({cpf: '11111111111'}))
		expect(res.status).toBe(StatusCodes.BAD_REQUEST)
	})

	it('Request with invalid cnpj', async () => {
		const res = await request(app)
			.post('/register')
			.set('Content-Type', 'application/json')
			.send(generateUser({cnpj: '53.03.919/0001-06'}))
		expect(res.status).toBe(StatusCodes.BAD_REQUEST)
	})

	it('Request with invalid state', async () => {
		const res = await request(app)
			.post('/register')
			.set('Content-Type', 'application/json')
			.send(generateUser({state: 'UU'}))
		expect(res.status).toBe(StatusCodes.BAD_REQUEST)
	})

	it('Request with invalid city', async () => {
		const res = await request(app)
			.post('/register')
			.set('Content-Type', 'application/json')
			.send(generateUser({state: 'RAIK'}))
		expect(res.status).toBe(StatusCodes.BAD_REQUEST)
	})

	it('Request with invalid neighborhood', async () => {
		const res = await request(app)
			.post('/register')
			.set('Content-Type', 'application/json')
			.send(generateUser({neighborhood: 'A'}))
		expect(res.status).toBe(StatusCodes.BAD_REQUEST)
	})

	it('Request with invalid street', async () => {
		const res = await request(app)
			.post('/register')
			.set('Content-Type', 'application/json')
			.send(generateUser({street: 'A'}))
		expect(res.status).toBe(StatusCodes.BAD_REQUEST)
	})

	it('Request with invalid zip', async () => {
		const res = await request(app)
			.post('/register')
			.set('Content-Type', 'application/json')
			.send(generateUser({zip: '2188811'}))
		expect(res.status).toBe(StatusCodes.BAD_REQUEST)
	})

	it('Request with invalid phone', async () => {
		const res = await request(app)
			.post('/register')
			.set('Content-Type', 'application/json')
			.send(generateUser({phone: '21 99999 x999'}))
		expect(res.status).toBe(StatusCodes.BAD_REQUEST)
	})

	it('CPF register', async () => {
		const res = await request(app)
			.post('/register')
			.set('Content-Type', 'application/json')
			.send(generateUser({email: 'test1@test.com', cpf: '256.344.287-77'}))
		expect(res.status).toBe(StatusCodes.CREATED)
	})

	it('CNPJ register', async () => {
		const res = await request(app)
			.post('/register')
			.set('Content-Type', 'application/json')
			.send(generateUser())
		expect(res.status).toBe(StatusCodes.CREATED)
	})

	it('Request conflict', async () => {
		const res = await request(app)
			.post('/register')
			.set('Content-Type', 'application/json')
			.send(generateUser())
		expect(res.status).toBe(StatusCodes.CONFLICT)
	})
})

describe('Login', () => {
	it('Request with no headers', async () => {
		const res = await request(app)
			.post('/login')
			.send()
		expect(res.status).toBe(StatusCodes.BAD_REQUEST)
	})

	it('Request with no body', async () => {
		const res = await request(app)
			.post('/login')
			.set('Content-Type', 'application/json')
			.send()
		expect(res.status).toBe(StatusCodes.BAD_REQUEST)
	})

	it('Request with invalid email', async () => {
		const res = await request(app)
			.post('/login')
			.set('Content-Type', 'application/json')
			.send({ password: '12345678', email: '@' })
		expect(res.status).toBe(StatusCodes.BAD_REQUEST)
	})

	it('Request with invalid password', async () => {
		const res = await request(app)
			.post('/login')
			.set('Content-Type', 'application/json')
			.send({email: 'test@test.com', password: '1234567'})
		expect(res.status).toBe(StatusCodes.BAD_REQUEST)
	})

	it('Request inexistent email', async () => {
		const res = await request(app)
			.post('/login')
			.set('Content-Type', 'application/json')
			.send({email: 'aaa@ggg', password: '12345678'})
		expect(res.status).toBe(StatusCodes.NOT_FOUND)
	})

	it('Request wrong password', async () => {
		const res = await request(app)
			.post('/login')
			.set('Content-Type', 'application/json')
			.send({email: 'test@test.com', password: '12345679'})
		expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
	})

	it('Right request', async () => {
		const res = await request(app)
			.post('/login')
			.set('Content-Type', 'application/json')
			.send({password: '12345678', email: 'test@test.com'})
		expect(res.status).toBe(StatusCodes.OK)
		expect(res.body.token).toBeDefined()
	})

	afterAll(async () => {
		await app.close()
		await app.db.close()
	})
})