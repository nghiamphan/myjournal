const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

let firstUserLoginResponse
let secondUserLoginResponse

beforeEach(async () => {
	await helper.setupInitialDatabase()
	firstUserLoginResponse = await api.post('/api/login').send({
		username: (await helper.firstUser()).username,
		password: (await helper.firstUser()).password
	})
})

describe('when there are initially some journals saved', () => {
	describe('if the authorization token is valid (user 1 logged in)', () => {
		test('journals are returned as json with status code 200', async () => {
			await api
				.get('/api/journals')
				.set({ Authorization: 'bearer ' + firstUserLoginResponse.body.token })
				.expect(200)
				.expect('Content-Type', /application\/json/)
		})

		test('all journals are returned', async () => {
			const response = await api.get('/api/journals')
				.set({ Authorization: 'bearer ' + firstUserLoginResponse.body.token })

			expect(response.body).toHaveLength(helper.initialJournals.length)
		})

		test('a specific journal is within the returned journals', async () => {
			const response = await api.get('/api/journals')
				.set({ Authorization: 'bearer ' + firstUserLoginResponse.body.token })

			const dates = response.body.map(r => r.date)
			expect(dates).toContain(helper.initialJournals[0].date)
		})

		describe('viewing a specific journal', () => {
			test('succeeds with status code 200 if id is valid', async () => {
				const journalsAtStart = await helper.journalsInDb()

				let journalToView = journalsAtStart[0]

				const response = await api
					.get(`/api/journals/${journalToView.id}`)
					.set({ Authorization: 'bearer ' + firstUserLoginResponse.body.token })
					.expect(200)
					.expect('Content-Type', /application\/json/)

				journalToView = { ...journalToView.toJSON(), user_id: journalToView.user_id.toString() }
				expect(response.body).toEqual(journalToView)
			})

			test('fails with status code 404 if journal does not exist', async () => {
				const users = await helper.usersInDb()
				const validNonexistingId = await helper.nonExistingId(users[0])

				await api
					.get(`/api/journals/${validNonexistingId}`)
					.set({ Authorization: 'bearer ' + firstUserLoginResponse.body.token })
					.expect(404)
			})

			test('fails with status code 400 id is in invalid format', async () => {
				const invalidId = '5a3d5da59070081a82a3445'

				await api
					.get(`/api/journals/${invalidId}`)
					.set({ Authorization: 'bearer ' + firstUserLoginResponse.body.token })
					.expect(400)
			})
		})

		describe('addition of a new journal', () => {
			test('succeeds with status 200 if data is valid', async () => {
				let newJournal = {
					...helper.initialJournals[0],
					date: '2020-01-01',
					reflections: [
						{
							content: 'add a new journal test',
						}
					]
				}

				await api
					.post('/api/journals')
					.send(newJournal)
					.set({ Authorization: 'bearer ' + firstUserLoginResponse.body.token })
					.expect(200)
					.expect('Content-Type', /application\/json/)

				const journalsAtEnd = await helper.journalsInDb()
				expect(journalsAtEnd).toHaveLength(helper.initialJournals.length + 1)

				const dates = journalsAtEnd.map(r => r.date)
				expect(dates).toContain(newJournal.date)
			})

			test('fails with status code 400 if date is missing', async () => {
				// eslint-disable-next-line no-unused-vars
				const { date, ...newJournal } = helper.initialJournals[0]

				await api
					.post('/api/journals')
					.send(newJournal)
					.set({ Authorization: 'bearer ' + firstUserLoginResponse.body.token })
					.expect(400)

				const journalsAtEnd = await helper.journalsInDb()
				expect(journalsAtEnd).toHaveLength(helper.initialJournals.length)

				const dates = journalsAtEnd.map(r => r.date)
				expect(dates).not.toContain(newJournal.date)
			})

			test('fails with status code 409 if date is duplicated', async () => {
				const newJournal = {
					...helper.initialJournals[0],
					reflections: [
						{
							content: 'add a new journal test',
						}
					]
				}

				const response = await api
					.post('/api/journals')
					.send(newJournal)
					.set({ Authorization: 'bearer ' + firstUserLoginResponse.body.token })
					.expect(409)

				expect(response.text).toEqual('{"error":"cannot post a journal with a duplicated date"}')

				const journalsAtEnd = await helper.journalsInDb()
				expect(journalsAtEnd).toHaveLength(helper.initialJournals.length)
			})

			test('fails with status code 409 if content is empty', async () => {
				const newJournal = {
					date: '1900-01-01',
					todos: [],
					reflections: [],
					book_summaries: [],
					quotes: [],
					words_of_today: []
				}

				const response = await api
					.post('/api/journals')
					.send(newJournal)
					.set({ Authorization: 'bearer ' + firstUserLoginResponse.body.token })
					.expect(409)

				expect(response.text).toEqual('{"error":"journal has no content"}')

				const journalsAtEnd = await helper.journalsInDb()
				expect(journalsAtEnd).toHaveLength(helper.initialJournals.length)

				const dates = journalsAtEnd.map(r => r.date)
				expect(dates).not.toContain(newJournal.date)
			})
		})

		describe('update a journal', () => {
			test('succeeds with status code 200 if data is valid', async () => {
				const journalsAtStart = await helper.journalsInDb()

				const updatedJournal = {
					...journalsAtStart[0].toJSON(),
					date: '2021-01-01',
					reflections: [
						{
							content: 'update a new journal test',
						}
					]
				}

				await api
					.put(`/api/journals/${updatedJournal.id}`)
					.send(updatedJournal)
					.set({ Authorization: 'bearer ' + firstUserLoginResponse.body.token })
					.expect(200)
					.expect('Content-Type', /application\/json/)

				const journalsAtEnd = await helper.journalsInDb()
				expect(journalsAtEnd).toHaveLength(helper.initialJournals.length)

				const dates = journalsAtEnd.map(r => r.date)
				expect(dates).toContain(updatedJournal.date)
			})

			test('fails with status code 400 if data is invalid', async () => {
				const journalsAtStart = await helper.journalsInDb()

				const updatedJournal = {
					...journalsAtStart[0].toJSON(),
					date: ''
				}

				await api
					.put(`/api/journals/${updatedJournal.id}`)
					.send(updatedJournal)
					.set({ Authorization: 'bearer ' + firstUserLoginResponse.body.token })
					.expect(400)

				const journalsAtEnd = await helper.journalsInDb()
				expect(journalsAtEnd).toHaveLength(helper.initialJournals.length)
			})

			test('fails with status code 409 if date is duplicated', async () => {
				const journalsAtStart = await helper.journalsInDb()

				const updatedJournal = {
					...journalsAtStart[0].toJSON(),
					date: journalsAtStart[1].date,
					reflections: [
						{
							content: 'update a new journal test',
						}
					]
				}

				const response = await api
					.put(`/api/journals/${updatedJournal.id}`)
					.send(updatedJournal)
					.set({ Authorization: 'bearer ' + firstUserLoginResponse.body.token })
					.expect(409)

				expect(response.text).toEqual('{"error":"cannot update a journal with a duplicated date"}')

				const journalsAtEnd = await helper.journalsInDb()
				expect(journalsAtEnd).toHaveLength(helper.initialJournals.length)
			})

			test('fails with status code 409 if content is empty', async () => {
				const journalsAtStart = await helper.journalsInDb()

				const updatedJournal = {
					date: '1900-01-01',
					todos: [],
					reflections: [],
					book_summaries: [],
					quotes: [],
					words_of_today: []
				}

				const response = await api
					.put(`/api/journals/${journalsAtStart[0]._id}`)
					.send(updatedJournal)
					.set({ Authorization: 'bearer ' + firstUserLoginResponse.body.token })
					.expect(409)

				expect(response.text).toEqual('{"error":"journal has no content"}')

				const journalsAtEnd = await helper.journalsInDb()
				expect(journalsAtEnd).toHaveLength(helper.initialJournals.length)

				const dates = journalsAtEnd.map(r => r.date)
				expect(dates).not.toContain(updatedJournal.date)
			})
		})

		describe('deletion of a journal', () => {
			test('succeeds with status code 204 if id is valid', async () => {
				const journalsAtStart = await helper.journalsInDb()
				const journalToDelete = journalsAtStart[0]

				await api
					.delete(`/api/journals/${journalToDelete.id}`)
					.set({ Authorization: 'bearer ' + firstUserLoginResponse.body.token })
					.expect(204)

				const journalAtEnd = await helper.journalsInDb()
				expect(journalAtEnd).toHaveLength(helper.initialJournals.length - 1)

				const dates = journalAtEnd.map(r => r.date)
				expect(dates).not.toContain(journalToDelete.date)
			})
		})
	})

	describe('if the authorization token is missing', () => {
		test('getting journals fails with status code 401', async () => {
			await api
				.get('/api/journals')
				.expect(401)
		})

		test('getting a specific journal fails with status code 401', async () => {
			const journalsAtStart = await helper.journalsInDb()

			let journalToView = journalsAtStart[0]

			await api
				.get(`/api/journals/${journalToView.id}`)
				.expect(401)
		})

		test('adding a journal fails with status code 401', async () => {
			const newJournal = {
				...helper.initialJournals[0],
				date: '2020-01-01',
				reflections: [
					{
						content: 'update a new journal test',
					}
				]
			}

			await api
				.post('/api/journals')
				.send(newJournal)
				.expect(401)

			const journalsAtEnd = await helper.journalsInDb()
			expect(journalsAtEnd).toHaveLength(helper.initialJournals.length)

			const dates = journalsAtEnd.map(r => r.date)
			expect(dates).not.toContain(newJournal.date)
		})


		test('updating a journal fails with status code 401', async () => {
			const journalsAtStart = await helper.journalsInDb()

			const updatedJournal = {
				...journalsAtStart[0].toJSON(),
				date: '2021-01-01',
				reflections: [
					{
						content: 'update a new journal test',
					}
				]
			}

			await api
				.put(`/api/journals/${updatedJournal.id}`)
				.send(updatedJournal)
				.expect(401)

			const journalsAtEnd = await helper.journalsInDb()
			expect(journalsAtEnd).toHaveLength(helper.initialJournals.length)

			const dates = journalsAtEnd.map(r => r.date)
			expect(dates).not.toContain(updatedJournal.date)
		})


		test('deleting a journal fails with status code 401', async () => {
			const journalsAtStart = await helper.journalsInDb()
			const journalToDelete = journalsAtStart[0]

			await api
				.delete(`/api/journals/${journalToDelete.id}`)
				.expect(401)

			const journalAtEnd = await helper.journalsInDb()
			expect(journalAtEnd).toHaveLength(helper.initialJournals.length)

			const dates = journalAtEnd.map(r => r.date)
			expect(dates).toContain(journalToDelete.date)

			const reflections = journalAtEnd.map(r => r.reflection)
			expect(reflections).toContain(journalToDelete.reflection)
		})
	})

	describe('if the authorization token is incompatible (user 2 has posted no journals)', () => {
		beforeEach(async () => {
			// Login with a user who did not create the journal
			const secondUser = new User(await helper.secondUser())
			await secondUser.save()

			secondUserLoginResponse = await api.post('/api/login').send({
				username: secondUser.username,
				password: (await helper.secondUser()).password
			})
		})

		test('getting journals returns an empty array', async () => {
			const response = await api
				.get('/api/journals')
				.set({ Authorization: 'bearer ' + secondUserLoginResponse.body.token })
				.expect(200)

			expect(response.body).toHaveLength(0)
		})

		test('getting a specific journal fails with status code 404', async () => {
			const journalsAtStart = await helper.journalsInDb()

			let journalToView = journalsAtStart[0]

			await api
				.get(`/api/journals/${journalToView.id}`)
				.set({ Authorization: 'bearer ' + secondUserLoginResponse.body.token })
				.expect(404)
		})

		test('updating a journal fails with status code 401 if the journal is updated by a user who did not create it', async () => {
			const journalsAtStart = await helper.journalsInDb()

			const updatedJournal = {
				...journalsAtStart[0].toJSON(),
				date: '2021-01-01',
				reflections: [
					{
						content: 'update a new journal test',
					}
				]
			}

			const journalResponse = await api
				.put(`/api/journals/${updatedJournal.id}`)
				.send(updatedJournal)
				.set({ Authorization: 'bearer ' + secondUserLoginResponse.body.token })
				.expect(401)

			expect(journalResponse.text).toEqual('{"error":"cannot update a journal created by other user"}')

			const journalsAtEnd = await helper.journalsInDb()
			expect(journalsAtEnd).toHaveLength(helper.initialJournals.length)

			const dates = journalsAtEnd.map(r => r.date)
			expect(dates).not.toContain(updatedJournal.date)
		})


		test('deleting a journal fails with status code 401 if the journal is deleted by a user who did not create it', async () => {
			const journalsAtStart = await helper.journalsInDb()
			const journalToDelete = journalsAtStart[0]

			const journalResponse = await api
				.delete(`/api/journals/${journalToDelete.id}`)
				.set({ Authorization: 'bearer ' + secondUserLoginResponse.body.token })
				.expect(401)

			expect(journalResponse.text).toEqual('{"error":"cannot delete a journal created by other user"}')

			const journalAtEnd = await helper.journalsInDb()
			expect(journalAtEnd).toHaveLength(helper.initialJournals.length)

			const dates = journalAtEnd.map(r => r.date)
			expect(dates).toContain(journalToDelete.date)
		})
	})
})

afterAll(() => {
	mongoose.connection.close()
})