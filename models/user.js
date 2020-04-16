const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	passwordHash: {
		type: String,
		required: true
	},
	journals: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Journal'
		}
	]
})

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
		delete returnedObject.passwordHash // passwordHash should not be revealed
	}
})

const User = mongoose.model('User', userSchema)

module.exports = User