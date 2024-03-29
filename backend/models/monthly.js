const mongoose = require('mongoose')

const monthlySchema = mongoose.Schema({
	date: {
		type: Date,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	}
})

monthlySchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Monthly', monthlySchema)