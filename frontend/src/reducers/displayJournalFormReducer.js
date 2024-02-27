const displayJournalFormReducer = (state = false, action) => {
	switch (action.type) {
	case 'SET_JOURNAL_FORM_DISPLAY_ON':
		return true
	case 'SET_JOURNAL_FORM_DISPLAY_OFF':
		return false
	case 'USER_LOGOUT':
		return false
	default:
		return state
	}
}

export const toggleJournalFormOn = () => {
	return {
		type: 'SET_JOURNAL_FORM_DISPLAY_ON'
	}
}

export const toggleJournalFormOff = () => {
	return {
		type: 'SET_JOURNAL_FORM_DISPLAY_OFF'
	}
}

export default displayJournalFormReducer