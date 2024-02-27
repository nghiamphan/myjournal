import journalService from '../services/journalService'

const initialState = {
	journals: [],
	displayedJournalId: null,
	journalToUpdateId: null
}

const journalsReducer = (state = initialState, action) => {
	switch (action.type) {
	case 'INIT_JOURNALS':
		return {
			journals: action.data,
			displayedJournalId: action.data.length > 0 ? action.data[action.data.length-1].id : null,
			journalToUpdateId: null
		}
	case 'CREATE_JOURNAL': {
		const newJournals = state.journals.concat(action.data)
			.sort((x, y) => x.date > y.date ? 1 : -1)
		return {
			journals: newJournals,
			displayedJournalId: action.data.id,
			journalToUpdateId: null
		}
	}
	case 'UPDATE_JOURNAL':
		return {
			journals: state.journals.map(journal => journal.id === action.data.id ? action.data : journal),
			displayedJournalId: action.data.id,
			journalToUpdateId: null
		}
	case 'DELETE_JOURNAL': {
		let nextDisplayedJournalId = null
		for (let i = 0; i < state.journals.length; i++) {
			const journal = state.journals[i]
			if (journal.id === action.id) {
				if (i < state.journals.length - 1) {
					nextDisplayedJournalId = state.journals[i+1].id
					break
				} else if (i > 0) {
					nextDisplayedJournalId = state.journals[i-1].id
					break
				}
			}
		}
		return {
			journals: state.journals.filter(journal => journal.id !== action.id),
			displayedJournalId: nextDisplayedJournalId,
			journalToUpdateId: null
		}
	}
	case 'SET_DISPLAYED_JOURNAL':
		return {
			...state,
			displayedJournalId: action.id,
			journalToUpdateId: null
		}
	case 'SET_JOURNAL_TO_UPDATE':
		return {
			...state,
			displayedJournalId: null,
			journalToUpdateId: action.id
		}
	case 'USER_LOGOUT':
		return initialState
	default:
		return state
	}
}

export const initializeJournals = () => {
	return async dispatch => {
		const journals = await journalService.getAll()
		journals.sort((x, y) => x.date > y.date ? 1 : -1)
		dispatch({
			type: 'INIT_JOURNALS',
			data: journals
		})
	}
}

export const createJournal = (journalObject) => {
	return async dispatch => {
		try {
			const newJournal = await journalService.createJournal(journalObject)
			dispatch({
				type: 'CREATE_JOURNAL',
				data: newJournal
			})
		} catch (exception) {
			console.log(exception.message)
		}
	}
}

export const updateJournal = (id, journalObject) => {
	return async dispatch => {
		try {
			const updatedJournal = await journalService.updateJournal(id, journalObject)
			dispatch({
				type: 'UPDATE_JOURNAL',
				data: updatedJournal
			})
		} catch (exception) {
			console.log(exception.message)
		}
	}
}

export const deleteJournal = id => {
	return async dispatch => {
		try {
			await journalService.deleteJournal(id)
			dispatch({
				type: 'DELETE_JOURNAL',
				id
			})
		} catch (exception) {
			console.log(exception.message)
		}
	}
}

export const setDisplayedJournalId = (id) => {
	return {
		type: 'SET_DISPLAYED_JOURNAL',
		id
	}
}

export const setJournalToUpdateId = (id) => {
	return {
		type: 'SET_JOURNAL_TO_UPDATE',
		id
	}
}

export default journalsReducer