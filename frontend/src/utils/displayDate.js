const displayDate = dateString => {
	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
	const date = new Date(dateString)
	return days[date.getDay()] + ' ' + date.toLocaleString()
}

export default displayDate