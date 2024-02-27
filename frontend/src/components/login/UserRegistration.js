import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import userRegistrationService from '../../services/userRegistrationService'
import { useHistory, Link } from 'react-router-dom'
import loginJournalImage from '../../images/login-journal.jpg'

const UserRegistration = () => {
	const [error, setError] = useState(null)
	const history = useHistory()

	const { register, handleSubmit, errors } = useForm()

	const handleRegistration = async data => {
		try {
			await userRegistrationService.register(data)
			history.push('/login')
		} catch (exception) {
			if (exception.response.data.error.includes('`username` to be unique')) {
				setError('Username already exists. Choose another username.')
			}
		}
	}

	return (
		<div className="my-page-container row">
			<div className="col-md-3">
				<h3>Registration</h3>

				<form onSubmit={handleSubmit(handleRegistration)}>
					<div className="form-group">
						<label className="h6">Username</label>
						<input
							className="form-control"
							type="text"
							name="username"
							ref={register({
								required: true,
								minLength: 4
							})}
						/>
					</div>
					{errors.username &&
					<span className="error-text">Username must have at least 4 characters.</span>
					}

					<div className="form-group">
						<label className="h6">Name</label>
						<input
							className="form-control"
							type="text"
							name="name"
							ref={register({
								required: true
							})}
						/>
					</div>
					{errors.name &&
					<span className="error-text">This field is required.</span>
					}

					<div className="form-group">
						<label className="h6">Password</label>
						<input
							className="form-control"
							type="password"
							name="password"
							ref={register({
								required: true,
								minLength: 4
							})}
						/>
					</div>
					{errors.password &&
					<span className="error-text">Password must have at least 4 characters.</span>
					}

					<div>
						<button
							className="btn btn-primary mr-3 my-medium-button"
							type="submit">
								Register
						</button>
					</div>
				</form>
				{<span className="error-text">{error}</span>}

				<p className="mt-3">
					Already have an account?&nbsp;
					<Link to='/login'>Login</Link>
				</p>
			</div>

			<div className="col-md-9">
				<img
					className="img-fluid"
					src={loginJournalImage}
					alt="A journal a day  makes bad habits go away"/>
			</div>
		</div>
	)
}

export default UserRegistration