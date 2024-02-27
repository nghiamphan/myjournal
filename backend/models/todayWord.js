const mongoose = require('mongoose')

const todayWordSchema = mongoose.Schema({
	word: {
		type: String,
		required: true
	},
	definition: {
		type: String,
		required: true
	}
})

todayWordSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = todayWordSchema