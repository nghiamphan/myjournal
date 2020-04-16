const journalsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Journal = require('../models/journal')
const User = require('../models/user')

journalsRouter.get('/', async (request, response) => {
	const journals = await Journal.find({})
		.populate('user_id', { username: 1, name: 1 })
	response.json(journals)
})

journalsRouter.get('/:id', async (request, response) => {
	const journal = await Journal.findById(request.params.id)
	if (journal) {
		response.json(journal)
	} else {
		response.status(404).end()
	}
})

const getTokenFrom = request => {
	const authorization = request.get('authorization')
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		return authorization.substring(7)
	}
	return null
}

journalsRouter.post('/', async (request, response) => {
	const body = request.body
	const token = getTokenFrom(request)

	const decodedToken = jwt.verify(token, process.env.SECRET)
	if (!token || !decodedToken.id) {
		return response.status(401).json({ error: 'token missing or invalid' })
	}
	const user = await User.findById(decodedToken.id)

	const journal = new Journal({
		date: body.date,
		todos: body.todos,
		reflection: body.reflection,
		book_summaries: body.book_summaries,
		words_of_today: body.words_of_today,
		user_id: user._id
	})

	const savedJournal = await journal.save()
	user.journals = user.journals.concat(savedJournal._id)
	await user.save()

	response.json(savedJournal)
})

journalsRouter.put('/:id', async (request, response) => {
	const body = request.body
	const token = getTokenFrom(request)

	const decodedToken = jwt.verify(token, process.env.SECRET)
	if (!token || !decodedToken.id) {
		return response.status(401).json({ error: 'token missing or invalid' })
	}
	const user = await User.findById(decodedToken.id)

	const journal = {
		date: body.date,
		todos: body.todos,
		reflection: body.reflection,
		book_summaries: body.book_summaries,
		words_of_today: body.words_of_today,
		user_id: user._id
	}

	const updatedJournal = await Journal.findByIdAndUpdate(request.params.id, journal, { new: true, runValidators: true })
	response.json(updatedJournal)
})

journalsRouter.delete('/:id', async (request, response) => {
	const token = getTokenFrom(request)

	const decodedToken = jwt.verify(token, process.env.SECRET)
	if (!token || !decodedToken.id) {
		return response.status(401).json({ error: 'token missing or invalid' })
	}
	const user = await User.findById(decodedToken.id)

	await Journal.findByIdAndRemove(request.params.id)
	user.journals = user.journals.filter(journal => journal.id !== request.params.id)
	await user.save()

	response.status(204).end()
})

module.exports = journalsRouter