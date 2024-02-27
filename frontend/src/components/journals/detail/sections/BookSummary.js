import React from 'react'

const BookSummary = ({ bookSummary }) => (
	<div className="book-summary-item">
		<div className="book-summary-header">
			<span className="book-title h6">
				{bookSummary.title}
			</span>
			{bookSummary.chapter &&
			<>
				Chapter: <i>{bookSummary.chapter}</i>
			</>
			}
		</div>
		<div dangerouslySetInnerHTML={{ __html: bookSummary.content }}/>
	</div>
)

export default BookSummary
