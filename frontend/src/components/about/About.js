import React from 'react'

const About = () => (
	<div className="about-page">
		<p>Hello and welcome to <em>My Journal</em>. I built this website as a personal project to learn about full stack web development. To take a quick look at the website, use &ldquo;root&rdquo; as both username and password to log in.</p>
		<p>Here are the main technologies, frameworks and libraries that I use.</p>

		<h6>Front end:</h6>
		<ul>
			<li><strong>React:</strong> Use JSX to write React components.</li>
			<li><strong>React-Redux:</strong> Manage data from a central &ldquo;store&rdquo;.</li>
			<li><strong>Axios:</strong> Make requests to and receive responses from the server.</li>
			<li><strong>React-Router:</strong> Manage navigation.</li>
			<li><strong>React-Hook-Form:</strong> Manage data input and validation for forms.</li>
		</ul>

		<h6>Back end:</h6>
		<ul>
			<li><strong>Nodejs/Express:</strong> Handle requests to the server.</li>
			<li><strong>MongoDB:</strong> The database is hosted on MongoDB Atlas cloud service.</li>
			<li><strong>Mongoose:</strong> Translate between Javascript objects and their representation in MongoDB, provide schema validation.</li>
			<li><strong>JSON Web Token:</strong> Encrypt and decrypt tokens used for token based authentication.</li>
			<li><strong>Bcrypt:</strong>  Generate the password hashes.</li>
			<li><strong>Dotenv:</strong> Configure environment variables.</li>
			<li><strong>Jest/Supertest:</strong> For writing backend tests.</li>
		</ul>
		<br/>

		<h5>Some quick notes about journaling</h5>
		<p>Almost every self-help book and advice mention journaling at some capacity, so it must be helpful, right? Of course, everyone has their own reasons, and there is no right or wrong way to write journals, but for me, those are the main benefits:</p>
		<ul>
			<li>Putting my thoughts into writing helps me think more clearly and assist with decision making. When I make a mistake, writing about my thinking and the circumstances that lead to it reminds me to avoid making the same mistake in the future.</li>
			<li>I write summaries for interesting books that I read and chip in my own opinion. Not only I retain useful information from the book longer, but I also sometimes gain new insights that I would not get if I only read books passively.</li>
			<li>It is simply fun to have a dialogue with myself.</li>
		</ul>
	</div>
)

export default About