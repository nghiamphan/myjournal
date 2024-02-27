import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateJournal } from '../../../../reducers/journalsReducer'

const Reflection = ({ reflection }) => {
	const backgroundColor = {
		backgroundColor: reflection.color
	}

	const dispatch = useDispatch()
	const journals = useSelector(state => state.journalsRedux.journals)
	const journalToUpdate = journals.filter(journal => journal.reflections.includes(reflection))[0]

	// One consequence of updating color via reducer's method updateJournal is that whatever the last journal whose reflection(s) is updated will become 'displayJournal' in the store (this scenario is relevant if the updating color happens when section filter is 'reflection')
	const onColorChange = event => {
		const updatedReflections = journalToUpdate.reflections.map(r => r.id === reflection.id
			? { ...r, color: event.target.value }
			: r
		)
		journalToUpdate.reflections = updatedReflections
		dispatch(updateJournal(journalToUpdate.id, journalToUpdate))
	}

	return (
		<div
			className="reflection-item"
			style={backgroundColor}
		>
			<input
				type="color"
				style={{ borderRadius: '0.25rem' }}
				title="Choose a color for the reflection card"
				value={reflection.color ? reflection.color : '#ffebcd'}
				onChange={onColorChange}
			/>
			<div dangerouslySetInnerHTML={{ __html: reflection.content }}/>
		</div>
	)
}

export default Reflection