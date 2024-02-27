import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons'
import { createMonthly } from '../../reducers/monthliesReducer'
import { toggleMonthlyFormOff } from '../../reducers/displayMonthlyFormReducer'

const AddMonthly = () => {
	const dispatch = useDispatch()

	const { register, handleSubmit, errors } = useForm()

	const onSubmit = data => {
		const monthlyObject = {
			content: data.content
		}
		dispatch(createMonthly(monthlyObject))
		dispatch(toggleMonthlyFormOff())
	}
	return (
		<div className="add-monthly">
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="monthly-header">
					<div className="monthly-date h6">
						Write your new monthly card
					</div>
					<button
						className="btn-sm btn-dark"
						title="Save"
						type="submit"
					>
						<FontAwesomeIcon icon={faSave}/>
					</button>
					<button
						className="btn-sm btn-dark"
						title="Cancel"
						type="reset"
						onClick={() => dispatch(toggleMonthlyFormOff())}
					>
						<FontAwesomeIcon icon={faTimes}/>
					</button>
				</div>
				<textarea
					className="monthly-input"
					placeholder="What have you done last month? What are your plans for next month?"
					name="content"
					ref={register({ required: true })}
				/>

				{errors.content && <span className="error-text">This field is required.</span>}
			</form>
		</div>
	)
}

export default AddMonthly