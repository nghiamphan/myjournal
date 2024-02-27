const bcrypt = require('bcrypt')
const Journal = require('../models/journal')
const User = require('../models/user')

const initialJournals = [
	{
		date: '2020-03-23',
		todos: [
			{
				id: 1,
				task: 'Learn React for two hours',
				done: true
			},
			{
				id: 2,
				task: 'Learn to skate for one hour',
				done: false
			}
		],
		reflections: [
			{
				content: 'Today is good.'
			},
			{
				content: 'Today is great.'
			}
		],
		book_summaries: [
			{
				id: 1,
				title: 'Catch-22',
				chapter: 'The Texan',
				content: 'This chapter is very interesting'
			}
		],
		quotes: [
			{
				content: 'You don’t want to live on this gay planet but you’re betting against the only person who can bring you to mars.',
				source: 'https://www.reddit.com/r/wallstreetbets/comments/g16ekl/what_the_fuck/fndom6q/',
				comment: 'Best quote I come upon on Reddit today.'
			}
		],
		words_of_today: [
			{
				id: 1,
				word: 'Epiphany',
				definition: 'A suddent moment of insight or realization.'
			}
		]
	},
	{
		date: '2020-03-24',
		todos: [
			{
				id: 1,
				task: 'Mediatation for 5 minutes',
				done: true
			}
		],
		reflections: [
			{
				content: 'Today is fantastic.'
			}
		],
		book_summaries: [
			{
				id: 1,
				title: 'Selfish Gene',
				chapter: '12',
				content: 'This chapter is very insightful.'
			}
		],
		quotes: [],
		words_of_today: []
	}
]

const firstUser = async () => {
	const passwordHash = await bcrypt.hash('root', 10)
	return {
		username: 'root',
		name: 'Root',
		password: 'root', // add password here for testing purpose only
		passwordHash
	}
}

const secondUser = async () => {
	const passwordHash = await bcrypt.hash('root', 10)
	return {
		username: 'secondUser',
		name: 'Second User',
		password: 'root', // add password here for testing purpose only
		passwordHash
	}
}

const nonExistingId = async user => {
	const journal = new Journal({
		date: '01/01/2020',
		todos: [],
		reflection: 'willremovethissoon',
		book_summaries: [],
		words_of_today: [],
		user_id: user._id
	})
	await journal.save()
	await journal.remove()

	return journal._id.toString()
}

const journalsInDb = async () => {
	const journals = await Journal.find({})
	return journals
}

const usersInDb = async () => {
	const users = await User.find({})
	return users
}

const setupInitialDatabase = async () => {
	// Set up initial user database
	await User.deleteMany({})

	const user = new User(await firstUser())

	const savedUser = await user.save()

	// Set up initial journal database, all journals created by first user
	await Journal.deleteMany({})

	const journalObjects = initialJournals
		.map(journal => new Journal({ ...journal, user_id: savedUser._id }))
	const promiseArray = journalObjects.map(journal => journal.save())
	await Promise.all(promiseArray)
}

module.exports = {
	initialJournals,
	firstUser,
	secondUser,
	nonExistingId,
	journalsInDb,
	usersInDb,
	setupInitialDatabase
}