import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	BrowserRouter as Router,
	Switch, Route, Link, Redirect
} from 'react-router-dom'

import journalService from './services/journalService'
import monthlyService from './services/monthlyService'
import { initializeJournals } from './reducers/journalsReducer'
import { initializeMonthlies } from './reducers/monthliesReducer'
import { userLogout } from './reducers/loginReducer'

import CalendarPage from './components/calendar/CalendarPage'
import MasterDetail from './components/journals/MasterDetail'
import Login from './components/login/Login'
import UserRegistration from './components/login/UserRegistration'
import About from './components/about/About'
import Footer from './components/footer/Footer'

const App = () => {
	const [route, setRoute] = useState(window.location.pathname)

	// user object received from backend contains token, username and password
	const user = useSelector(state => state.loginRedux)
	if (user) {
		journalService.setToken(user.token)
		monthlyService.setToken(user.token)
	}

	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(initializeJournals())
		dispatch(initializeMonthlies())
	}, [dispatch, user])

	const setBackground = (location) => {
		if (location === route) {
			return { backgroundColor: 'cornsilk' }
		}
	}

	return (
		<div>
			<Router>
				<nav className="nav bg-dark">
					<Link
						className="navbar-brand"
						onClick={() => setRoute('/journals')}
						to="/journals"
					>
						My Journal
					</Link>

					{user &&
					<Link
						className="nav-link"
						style={setBackground('/calendar')}
						onClick={() => setRoute('/calendar')}
						to="/calendar"
					>
						Calendar
					</Link>
					}

					{user &&
					<Link
						className="nav-link"
						style={setBackground('/journals')}
						onClick={() => setRoute('/journals')}
						to="/journals"
					>
						Journals
					</Link>
					}

					<Link
						className="nav-link"
						style={setBackground('/about')}
						onClick={() => setRoute('/about')}
						to="/about"
					>
							About
					</Link>

					{!user &&
					<Link
						className="nav-link ml-auto"
						to="/login"
					>
						Login
					</Link>
					}

					{user &&
					<Link
						className="nav-link ml-auto"
						onClick={() => dispatch(userLogout())}
						to="/login"
					>
						Logout
					</Link>
					}
				</nav>

				<Switch>
					<Route path="/login">
						{!user ? <Login/> : <Redirect to="/journals"/>}
						<Footer/>
					</Route>
					<Route path='/register'>
						<UserRegistration/>
						<Footer/>
					</Route>
					<Route path="/calendar">
						{user ? <CalendarPage/> : <Redirect to="/login"/>}
						<Footer/>
					</Route>
					<Route path="/journals">
						{user ? <MasterDetail/> : <Redirect to="/login"/>}
					</Route>
					<Route path="/about">
						<About/>
						<Footer/>
					</Route>
					<Route path="/">
						{user ? <Redirect to="/calendar"/> : <Redirect to="/login"/>}
					</Route>
				</Switch>
			</Router>
		</div>
	)
}

export default App
