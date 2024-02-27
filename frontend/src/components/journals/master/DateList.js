import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { setDisplayedJournalId } from '../../../reducers/journalsReducer'

const DateList = () => {
	const [dateFilter, setDateFilter] = useState('')

	const dispatch = useDispatch()
	const journals = useSelector(state => state.journalsRedux.journals)
	const displayedJournalId = useSelector(state => state.journalsRedux.displayedJournalId)
	const journalToUpdateId = useSelector(state => state.journalsRedux.journalToUpdateId)

	return (
		<div className="date-list-page">
			<input
				className="date-search-box"
				type="text"
				placeholder="Search Date"
				value={dateFilter}
				onChange={event => setDateFilter(event.target.value)}
			/>
			<div className="date-list">
				{journals && journals.length > 0 && journals.map(journal =>
					(journal.date.includes(dateFilter) &&
					<div
						key={journal.id}
						onClick={() => dispatch(setDisplayedJournalId(journal.id))}>
						<div className="h6 date-list-item">
							{journal.date}&nbsp;
							{(journal.id === displayedJournalId || journal.id === journalToUpdateId )&&
							<FontAwesomeIcon icon={faEllipsisV}/>}
						</div>
					</div>
					)
				)}
			</div>
		</div>
	)
}

export default DateList