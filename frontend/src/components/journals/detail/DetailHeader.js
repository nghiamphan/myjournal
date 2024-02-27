import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { setDisplayedJournalId, setJournalToUpdateId, deleteJournal } from '../../../reducers/journalsReducer'
import { toggleJournalFormOn } from '../../../reducers/displayJournalFormReducer'
import { setSectionFilter } from '../../../reducers/sectionFilterReducer'

const DetailHeader = () => {
	const dispatch = useDispatch()
	const sectionFilter = useSelector(state => state.sectionFilter)
	const displayedJournalId = useSelector(state => state.journalsRedux.displayedJournalId)
	const displayJournalForm = useSelector(state => state.displayJournalForm)

	const addJournal = () => {
		dispatch(setDisplayedJournalId(null))
		dispatch(toggleJournalFormOn())
	}

	const updateJournal = () => {
		dispatch(setJournalToUpdateId(displayedJournalId))
		dispatch(toggleJournalFormOn())
	}

	return (
		<div className="detail-header flex-container">
			<div className="detail-header-button-group">
				{(displayedJournalId || !displayJournalForm) &&
				sectionFilter === 'all' &&
				<button
					className="btn btn-dark detail-header-button"
					title="Write a new journal"
					onClick={addJournal}
				>
					<FontAwesomeIcon icon={faPlus}/>
				</button>
				}
				{displayedJournalId && sectionFilter === 'all' &&
				<>
					<button
						className="btn btn-dark detail-header-button"
						title="Update the journal"
						onClick={updateJournal}
					>
						<FontAwesomeIcon icon={faEdit}/>
					</button>

					<button
						className="btn btn-dark detail-header-button"
						title="Delete the journal"
						onClick={() => dispatch(deleteJournal(displayedJournalId))}
					>
						<FontAwesomeIcon icon={faTrash}/>
					</button>

				</>
				}
			</div>

			<div className="detail-header-filter">
				<label className="h6">Filter&nbsp;</label>
				<select
					onChange={event => dispatch(setSectionFilter(event.target.value))}>
					<option value="all">All</option>
					<option value="todos">Todo</option>
					<option value="reflections">Reflection</option>
					<option value="book_summaries">Book Summary</option>
					<option value="quotes">Quote</option>
					<option value="words_of_today">Word of the Day</option>
				</select>
			</div>
		</div>
	)
}

export default DetailHeader