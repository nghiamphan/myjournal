import React from 'react'

const Footer = () => {
	const footerStyle = {
		backgroundColor: '#292b2c',
		color: 'white',
		height: 100,
		paddingTop: 20,

		position: 'absolute',
		bottom: 0,
		width: '100%'
	}

	const quoteStyle = {
		fontSize: 18,
		paddingLeft: '10%'
	}

	const sourceStyle = {
		fontSize: 16,
		paddingLeft: '30%'
	}

	return (
		<div style={footerStyle}>
			<em style={quoteStyle}>- A journal a day  makes bad habits go away</em> <br/>
			<p style={sourceStyle}>Me, 2020.</p>
		</div>
	)
}

export default Footer