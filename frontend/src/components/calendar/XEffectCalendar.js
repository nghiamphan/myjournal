import React from 'react'
import { useSelector } from 'react-redux'
import Calendar from 'react-calendar'

const XEffectCalendar = () => {
	const journals = useSelector(state => state.journalsRedux.journals)

	let days = []
	if (journals.length > 0) {
		journals.map(journal => {
			const notDoneTodos = journal.todos.filter(todo => !todo.done)
			if (notDoneTodos.length === 0) {
				const day = new Date(journal.date)
				day.setMinutes(day.getTimezoneOffset())
				days.push(day)
			}
			return null
		})
	}

	const crossOffDays = ({ date, view }) => {
		// When compare days in sorted array 'days' and active days displayed in the calendar, 'cur' is the position of the first item in 'days' that is not yet smaller than the currently compared active day in the calendar.
		let cur = 0
		if (view === 'month') {
			for (let i = cur; i < days.length; i++) {
				const day = days[i]
				if (day.getTime() === date.getTime()) {
					cur ++
					return 'cross-off-day'
				} else if (day.getTime() < date.getTime()) {
					cur ++
				}
			}
		}
		return null
	}

	return (
		<Calendar
			tileClassName={crossOffDays}/>
	)
}

export default XEffectCalendar