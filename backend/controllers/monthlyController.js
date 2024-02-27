const monthliesRouter = require('express').Router()
const Monthly = require('../models/monthly')
const User = require('../models/user')

monthliesRouter.get('/', async (request, response) => {
	const user = await User.findById(request.userId)

	const monthlies = await Monthly.find({ user_id: user._id })
		.populate('user_id', { username: 1, name: 1 })
	response.json(monthlies)
})

monthliesRouter.get('/:id', async (request, response) => {
	const user = await User.findById(request.userId)

	const monthly = await Monthly.findById(request.params.id)
	if (monthly && monthly.user_id.toString() === user._id.toString()) {
		response.json(monthly)
	} else {
		response.status(404).end()
	}
})

monthliesRouter.post('/', async (request, response) => {
	const body = request.body
	const user = await User.findById(request.userId)

	const monthly = new Monthly({
		date: new Date(),
		content: body.content,
		user_id: user._id
	})

	const savedMonthly = await monthly.save()
	user.monthlies = user.monthlies.concat(savedMonthly._id)
	await user.save()

	response.json(savedMonthly)
})

monthliesRouter.put('/:id', async (request, response) => {
	const body = request.body
	const user = await User.findById(request.userId)

	const monthlyToUpdate = await Monthly.findById(request.params.id)
	if (monthlyToUpdate.user_id.toString() !== user._id.toString()) {
		return response.status(401).status({ error: 'cannot update a monthly summary created by other user' })
	}

	const monthly = {
		content: body.content
	}

	const updatedMonthly = await Monthly.findByIdAndUpdate(request.params.id, monthly, { new: true, runValidators: true })
	response.json(updatedMonthly)
})

monthliesRouter.delete('/:id', async (request, response) => {
	const user = await User.findById(request.userId)

	const monthlyToDelete = await Monthly.findById(request.params.id)
	if (monthlyToDelete.user_id.toString() !== user._id.toString()) {
		return response.status(401).json({ error: 'cannot delete a monthly summary created by other user' })
	}

	await Monthly.findByIdAndRemove(request.params.id)
	user.monthlies = user.monthlies.filter(monthly => monthly.id !== request.params.id)
	await user.save()

	response.status(204).end()
})

module.exports = monthliesRouter