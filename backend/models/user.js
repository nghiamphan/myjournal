const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
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
	],
	monthlies: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Monthly'
		}
	]
})

userSchema.plugin(uniqueValidator)

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