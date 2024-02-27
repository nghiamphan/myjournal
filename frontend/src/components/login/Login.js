import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { userLogin } from '../../reducers/loginReducer'
import { Link } from 'react-router-dom'
import loginJournalImage from '../../images/login-journal.jpg'

const Login = () => {
	const [loginError, setLoginError] = useState(null)
	const [displayInfoBox, setDisplayInfoBox] = useState(true)
	const dispatch = useDispatch()

	const { register, handleSubmit, errors } = useForm()

	const handleLogin = async data => {
		await dispatch(userLogin(data.username, data.password))
		const loggedInUser = JSON.parse(window.localStorage.getItem('loggedInMyJournalAppUser'))
		if (!loggedInUser) {
			setLoginError('Wrong credentials.')
		}
	}

	return (
		<div className="my-page-container row">
			<div className="col-md-3">
				<h3>Login</h3>

				<form onSubmit={handleSubmit(handleLogin)}>
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
					<span className="error-text">This field is required.</span>
					}

					<div >
						<button
							className="btn btn-primary mr-3 my-medium-button"
							type="submit"
						>
						Login
						</button>
						<button className="btn btn-primary my-medium-button">
							<Link
								className="register-link"
								to='/register'
							>
								Register
							</Link>
						</button>
					</div>
				</form>
				<span className="error-text">{loginError}</span>

				{displayInfoBox &&
				<div className="info-box">
					<button
						className="cross-button"
						onClick={() => setDisplayInfoBox(false)}>
						<span>&times;</span>
					</button>
					Welcome to My Journal. Use &ldquo;root&rdquo; as both username and password for a quick demo. Or go to the about-page to learn more.
				</div>
				}
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

export default Login