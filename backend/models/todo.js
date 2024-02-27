const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
	done: {
		type: Boolean,
		default: false,
		required: true
	},
	task: {
		type: String,
		required: true
	}
})

todoSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = todoSchema