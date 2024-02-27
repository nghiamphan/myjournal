const mongoose = require('mongoose')

const bookSummarySchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	chapter: {
		type: String
	},
	content: {
		type: String,
		required: true
	}
})

bookSummarySchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = bookSummarySchema