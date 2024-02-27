import React from 'react'

const Quote = ({ quote }) => (
	<div className="quote-item">
		<blockquote className="quote-content">
			<i>&ldquo;{quote.content}&rdquo;</i>
		</blockquote>
		{quote.source &&
		<div className="quote-source">
			- {quote.source}
		</div>
		}
		{quote.comment &&
		<div>
			{quote.comment}
		</div>
		}
	</div>
)

export default Quote