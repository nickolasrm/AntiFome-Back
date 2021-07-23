process.env.ENV = 'test'

const request = require('supertest')
const { StatusCodes } = require('http-status-codes')
const app = require('../app')

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
			.send({ username: 'Test', password: '12345678', email: '@' })
		expect(res.status).toBe(StatusCodes.BAD_REQUEST)
	})

	it('Request with invalid username', async () => {
		const res = await request(app)
			.post('/register')
			.set('Content-Type', 'application/json')
			.send({
				username: 'AB', password: '12345678', email: 'test@gmail.com',
				cpf: '25634428777'
			})
		expect(res.status).toBe(StatusCodes.BAD_REQUEST)
	})

	it('Request with invalid password', async () => {
		const res = await request(app)
			.post('/register')
			.set('Content-Type', 'application/json')
			.send({
				username: 'Test', password: '1234567', email: 'test@gmail.com',
				cpf: '25634428777'
			})
		expect(res.status).toBe(StatusCodes.BAD_REQUEST)
	})

	it('Request with invalid cpf', async () => {
		const res = await request(app)
			.post('/register')
			.set('Content-Type', 'application/json')
			.send({
				username: 'Test', password: '1234567', email: 'test@gmail.com',
				cpf: '111.111.111'
			})
		expect(res.status).toBe(StatusCodes.BAD_REQUEST)
	})

	it('Request with invalid cnpj', async () => {
		const res = await request(app)
			.post('/register')
			.set('Content-Type', 'application/json')
			.send({
				username: 'Test', password: '1234567', email: 'test@gmail.com',
				cnpj: '58.03.919/0001-06'
			})
		expect(res.status).toBe(StatusCodes.BAD_REQUEST)
	})

	it('CPF register', async () => {
		const res = await request(app)
			.post('/register')
			.set('Content-Type', 'application/json')
			.send({
				username: 'Test',
				password: '12345678',
				email: 'test@test.com',
				cpf: '256.344.287-77'
			})
		expect(res.status).toBe(StatusCodes.CREATED)
	})

	it('CNPJ register', async () => {
		const res = await request(app)
			.post('/register')
			.set('Content-Type', 'application/json')
			.send({
				username: 'Test',
				password: '12345678',
				email: 'test2@test.com',
				cnpj: '58.403.919/0001-06'
			})
		expect(res.status).toBe(StatusCodes.CREATED)
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
			.send({
				password: '1234567', email: 'test@gmail.com'
			})
		expect(res.status).toBe(StatusCodes.BAD_REQUEST)
	})

	it('Request inexistent email', async () => {
		const res = await request(app)
			.post('/login')
			.set('Content-Type', 'application/json')
			.send({
				password: '12345678', email: 'test@gmail3.com'
			})
		expect(res.status).toBe(StatusCodes.NOT_FOUND)
	})

	it('Request wrong password', async () => {
		const res = await request(app)
			.post('/login')
			.set('Content-Type', 'application/json')
			.send({
				password: '12345679', email: 'test@test.com'
			})
		expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
	})

	it('Right request', async () => {
		const res = await request(app)
			.post('/login')
			.set('Content-Type', 'application/json')
			.send({
				password: '12345678', email: 'test@test.com'
			})
		expect(res.status).toBe(StatusCodes.OK)
		expect(res.body.token).toBeDefined()
	})

	afterAll(async () => {
		await app.close()
		await app.db.close()
	})
})