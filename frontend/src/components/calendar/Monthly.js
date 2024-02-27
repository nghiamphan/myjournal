import React from 'react'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { toggleMonthlyUpdateForm, deleteMonthly } from '../../reducers/monthliesReducer'
import displayDate from '../../utils/displayDate'

const Monthly = ({ monthly }) => {
	const dispatch = useDispatch()

	return (
		<div className="monthly">
			<div className="monthly-header">
				<div className="monthly-date h6">
					{displayDate(monthly.date)}
				</div>
				<button
					className="btn-sm btn-dark"
					title="Edit this monthly card"
					onClick={() => dispatch(toggleMonthlyUpdateForm(monthly.id))}
				>
					<FontAwesomeIcon icon={faPen}/>
				</button>
				<button
					className="btn-sm btn-dark"
					title="Delete this monthly card"
					onClick={() => dispatch(deleteMonthly(monthly.id))}
				>
					<FontAwesomeIcon icon={faTrash}/>
				</button>
			</div>
			<div dangerouslySetInnerHTML={{ __html: monthly.content }}/>
		</div>
	)
}

export default Monthly