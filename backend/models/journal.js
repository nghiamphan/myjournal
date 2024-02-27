const mongoose = require('mongoose')
const reflectionSchema=require('./reflection')
const bookSummarySchema = require('./bookSummary')
const quoteSchema = require('./quote')
const todayWordSchema = require('./todayWord')
const todoSchema = require('./todo')

const journalSchema = new mongoose.Schema({
	date: {
		type: String,
		required: true
	},
	todos: [todoSchema],
	reflections: [reflectionSchema],
	book_summaries: [bookSummarySchema],
	quotes: [quoteSchema],
	words_of_today: [todayWordSchema],
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	}
})

journalSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Journal', journalSchema)