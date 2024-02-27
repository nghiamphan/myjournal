const journalsRouter = require('express').Router()
const Journal = require('../models/journal')
const User = require('../models/user')

const isEmptyJournal = (body) => (
	(!body.todos || body.todos.length === 0)
	&& (!body.reflections || body.reflections.length === 0)
	&& (!body.book_summaries || body.book_summaries.length === 0)
	&& (!body.quotes || body.quotes.length === 0)
	&& (!body.words_of_today || body.words_of_today.length === 0)
)

journalsRouter.get('/', async (request, response) => {
	const user = await User.findById(request.userId)

	const journals = await Journal.find({ user_id: user._id })
		.populate('user_id', { username: 1, name: 1 })
	response.json(journals)
})

journalsRouter.get('/:id', async (request, response) => {
	const user = await User.findById(request.userId)

	const journal = await Journal.findById(request.params.id)
	if (journal && journal.user_id.toString() === user._id.toString()) {
		response.json(journal)
	} else {
		response.status(404).end()
	}
})

journalsRouter.post('/', async (request, response) => {
	const body = request.body

	if (isEmptyJournal(body)) {
		return response.status(409).json({ error: 'journal has no content' })
	}

	const user = await User.findById(request.userId)

	const journals = await Journal.find({ user_id: user._id })
	const duplicatedDate = journals.find(journal => journal.date === body.date)
	if (duplicatedDate) {
		return response.status(409).json({ error: 'cannot post a journal with a duplicated date' })
	}

	const journal = new Journal({
		date: body.date,
		todos: body.todos,
		reflections: body.reflections,
		book_summaries: body.book_summaries,
		quotes: body.quotes,
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

	if (isEmptyJournal(body)) {
		return response.status(409).json({ error: 'journal has no content' })
	}

	const user = await User.findById(request.userId)

	const journalToUpdate = await Journal.findById(request.params.id)
	if (journalToUpdate.user_id.toString() !== user._id.toString()) {
		return response.status(401).json({ error: 'cannot update a journal created by other user' })
	}

	const journals = await Journal.find({ user_id: user._id })
	const duplicatedDate = journals.find(journal => journal.date === body.date && journal._id.toString() !== request.params.id)
	if (duplicatedDate) {
		return response.status(409).json({ error: 'cannot update a journal with a duplicated date' })
	}

	const journal = {
		date: body.date,
		todos: body.todos,
		reflections: body.reflections,
		book_summaries: body.book_summaries,
		quotes: body.quotes,
		words_of_today: body.words_of_today,
		user_id: user._id
	}

	const updatedJournal = await Journal.findByIdAndUpdate(request.params.id, journal, { new: true, runValidators: true })
	response.json(updatedJournal)
})

journalsRouter.delete('/:id', async (request, response) => {
	const user = await User.findById(request.userId)

	const journalToDelete = await Journal.findById(request.params.id)
	if (journalToDelete.user_id.toString() !== user._id.toString()) {
		return response.status(401).json({ error: 'cannot delete a journal created by other user' })
	}

	await Journal.findByIdAndRemove(request.params.id)
	user.journals = user.journals.filter(journal => journal.id !== request.params.id)
	await user.save()

	response.status(204).end()
})

module.exports = journalsRouter