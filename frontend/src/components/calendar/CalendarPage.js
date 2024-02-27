import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import XEffectCalendar from './XEffectCalendar'
import Monthly from './Monthly'
import MonthlyEditable from './MonthlyEditable'
import AddMonthly from './AddMonthly'
import { toggleMonthlyFormOn } from '../../reducers/displayMonthlyFormReducer'

const CalendarPage = () => {
	const dispatch = useDispatch()

	const monthlies = useSelector(state => state.monthlies)
	const displayMonthlyForm = useSelector(state => state.displayMonthlyForm)

	return (
		<div className="calendar-page flex-container">
			<XEffectCalendar/>
			{displayMonthlyForm
				? <AddMonthly/>
				: <button
					className="add-monthly-button btn btn-dark"
					onClick={() => dispatch(toggleMonthlyFormOn())}
				>
				Write a new monthly update
				</button>
			}
			{monthlies.length > 0 &&
			monthlies.map(monthly =>
				monthly.editable
					? <MonthlyEditable
						key={monthly.id}
						monthly={monthly}
					/>
					: <Monthly
						key={monthly.id}
						monthly={monthly}
					/>
			)}
		</div>
	)
}

export default CalendarPage