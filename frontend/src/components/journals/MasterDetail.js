import React from 'react'
import { useSelector } from 'react-redux'
import DateList from './master/DateList'
import Journal from './detail/Journal'
import AddAndUpdateJournal from '../journals/detail/AddAndUpdateJournal'
import DetailHeader from './detail/DetailHeader'

const MasterDetail = () => {
	const journals = useSelector(state => state.journalsRedux.journals)
	const sectionFilter = useSelector(state => state.sectionFilter)
	const displayedJournalId = useSelector(state => state.journalsRedux.displayedJournalId)
	const displayedJournal = displayedJournalId ? journals.find(journal => journal.id === displayedJournalId) : null

	const displayJournalForm = useSelector(state => state.displayJournalForm)

	return (
		<div className="flex-container">
			<DateList/>
			<div className="detail-section">
				{(displayedJournalId || journals.length === 0) && <DetailHeader/>}
				{sectionFilter === 'all'
					? displayedJournal
						? <Journal journal={displayedJournal}/>
						: displayJournalForm
							? <AddAndUpdateJournal/>
							: <p>Write your first journal...</p>
					: journals.map(journal => <Journal key={journal.id} journal={journal} />)
				}
			</div>

		</div>
	)
}

export default MasterDetail