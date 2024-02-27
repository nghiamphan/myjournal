const jwt = require('jsonwebtoken')
const logger = require('./logger')

const tokenExtractor = (request, response, next) => {
	const authorization = request.get('authorization')
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		request.token = authorization.substring(7)
	} else {
		request.token = null
	}
	next()
}

const tokenValidation = (request, response, next) => {
	const token = request.token

	if (request.path.includes('/api/journals')
	|| request.path.includes('/api/monthlies'))  {
		const decodedToken = jwt.verify(token, process.env.SECRET)
		if (!token || !decodedToken.id) {
			// Not really necessary here, since if the token is invalid during jwt.verify(token), the program will move straight to errorHandler middleware
			return response.status(401).json({ error: 'token missing or invalid' })
		} else {
			request.userId = decodedToken.id
		}
	}
	next()
}

const requestLogger = (request, response, next) => {
	logger.info('Method:', request.method)
	logger.info('Path:  ', request.path)
	logger.info('Body:  ', request.body)
	logger.info('---')
	next()
}

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
	logger.error('error handler middleware: ', error.message)

	if (error.name === 'CastError') {
		// For some reason, error.kind === undefined?
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	} else if (error.name === 'JsonWebTokenError') {
		return response.status(401).json({
			error: 'invalid token'
		})
	} else if (error.message.includes('Cannot read property \'user_id\' of null')) {
		return response.status(401).json({
			error: 'resource not found'
		})
	} else if (error.message.includes('Cannot read property \'_id\' of null')) {
		return response.status(401).json({
			error: 'user not found'
		})
	}
	next(error)
}

module.exports = {
	tokenExtractor,
	tokenValidation,
	requestLogger,
	unknownEndpoint,
	errorHandler
}