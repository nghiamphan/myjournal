import axios from 'axios'

const baseUrl = 'api/monthlies'

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

const createMonthly = async (monthlyObject) => {
	const config = {
		headers: { Authorization: token }
	}
	const response = await axios.post(baseUrl, monthlyObject, config)
	return response.data
}

const updateMonthly = async (id, monthlyObject) => {
	const config = {
		headers: { Authorization: token }
	}
	const response = await axios.put(`${baseUrl}/${id}`, monthlyObject, config)
	return response.data
}

const deleteMonthly = async id => {
	const config = {
		headers: { Authorization: token }
	}
	const response = await axios.delete(`${baseUrl}/${id}`, config)
	return response.data
}

export default {
	getAll,
	createMonthly,
	updateMonthly,
	deleteMonthly,
	setToken
}