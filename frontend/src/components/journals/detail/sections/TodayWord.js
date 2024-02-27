import React from 'react'

const TodayWord = ({ vocabulary }) => (
	<div className="word-item">
		<strong>{vocabulary.word}</strong>
		<br/>
		{vocabulary.definition}
	</div>
)

export default TodayWord
