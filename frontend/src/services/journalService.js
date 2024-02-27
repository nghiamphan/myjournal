import axios from 'axios'

const baseUrl = '/api/journals'

let token = null

const setToken = newToken => {
	token = `bearer ${newToken}`
}

const getAll = async () => {
	const config = {
		headers: { Authorization: token }
	}
	if (token) {
		const response = await axios.get(baseUrl, config)
		return response.data
	} else {
		return []
	}
}

const createJournal = async (journalObject) => {
	const config = {
		headers: { Authorization: token }
	}
	const response = await axios.post(baseUrl, journalObject, config)
	return response.data
}

const updateJournal = async (id, journalObject) => {
	const config = {
		headers: { Authorization: token }
	}
	const response = await axios.put(`${baseUrl}/${id}`, journalObject, config)
	return response.data
}

const deleteJournal = async id => {
	const config = {
		headers: { Authorization: token }
	}
	const response = await axios.delete(`${baseUrl}/${id}`, config)
	return response.data
}

export default {
	getAll,
	createJournal,
	updateJournal,
	deleteJournal,
	setToken
}