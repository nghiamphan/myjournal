const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially one user at db', () => {
	beforeEach(async () => {
		await User.deleteMany({})

		const user = new User(await helper.firstUser())

		await user.save()
	})

	test('creation succeeds with a fresh username', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'admin',
			name: 'Super User',
			password: 'password',
		}

		await api
			.post('/api/users')
			.send(newUser)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

		const usernames = usersAtEnd.map(u => u.username)
		expect(usernames).toContain(newUser.username)
	})

	test('creation fails with a duplicated username', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'root',
			name: 'Root',
			password: 'root',
		}

		await api
			.post('/api/users')
			.send(newUser)
			.expect(400)

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length)
	})
})

afterAll(() => {
	mongoose.connection.close()
})