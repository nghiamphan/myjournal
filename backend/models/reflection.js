const mongoose = require('mongoose')

const reflectionSchema = mongoose.Schema({
	content: {
		type: String,
		required: true
	},
	color: String
})

reflectionSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = reflectionSchema