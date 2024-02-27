const sectionFilterReducer = (state = 'all', action) => {
	switch (action.type) {
	case 'SET_SECTION_FILTER':
		return action.section
	case 'USER_LOGOUT':
		return 'all'
	default:
		return state
	}
}

export const setSectionFilter = (section) => {
	return {
		type: 'SET_SECTION_FILTER',
		section
	}
}

export default sectionFilterReducer