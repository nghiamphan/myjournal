const displayMonthlyFormReducer = (state = false, action) => {
	switch (action.type) {
	case 'SET_MONTHLY_FORM_DISPLAY_ON':
		return true
	case 'SET_MONTHLY_FORM_DISPLAY_OFF':
		return false
	case 'USER_LOGOUT':
		return false
	default:
		return state
	}
}

export const toggleMonthlyFormOn = () => {
	return {
		type: 'SET_MONTHLY_FORM_DISPLAY_ON'
	}
}

export const toggleMonthlyFormOff = () => {
	return {
		type: 'SET_MONTHLY_FORM_DISPLAY_OFF'
	}
}

export default displayMonthlyFormReducer