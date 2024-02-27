const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const loginRouter = require('./controllers/loginController')
const journalsRouter = require('./controllers/journalController')
const monthliesRouter = require('./controllers/monthlyController')
const usersRouter = require('./controllers/userController')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const path = require('path')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, {
	useCreateIndex: true,
	useFindAndModify: false,
	useNewUrlParser: true,
	useUnifiedTopology: true
})
	.then(() => {
		logger.info('connect to MongoDB')
	})
	.catch((error) => {
		logger.error('error connecting to MongoDB: ', error.message)
	})

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(middleware.tokenValidation)
app.use(middleware.requestLogger)

app.use('/api/login', loginRouter)
app.use('/api/journals', journalsRouter)
app.use('/api/monthlies', monthliesRouter)
app.use('/api/users', usersRouter)

const frontendRoutes = [
	'/login',
	'/calendar',
	'/journals',
	'/about'
]
app.get(frontendRoutes, (request , response) => {
	response.sendFile(path.join(__dirname + '/build/index.html'))
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app