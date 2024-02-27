import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons'
import { toggleMonthlyUpdateForm, updateMonthly } from '../../reducers/monthliesReducer'
import displayDate from '../../utils/displayDate'

const MonthlyEditable = ({ monthly }) => {
	const dispatch = useDispatch()

	const { register, handleSubmit, errors } = useForm({
		defaultValues: monthly
	})

	const onSubmit = data => {
		const monthlyObject = {
			content: data.content
		}
		dispatch(updateMonthly(monthly.id, monthlyObject))
	}

	return (
		<div className="monthly-editable">
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="monthly-header">
					<div className="monthly-date h6">
						{displayDate(monthly.date)}
					</div>
					<button
						className="btn-sm btn-dark"
						title="Save the change"
						type="submit"
					>
						<FontAwesomeIcon icon={faSave}/>
					</button>
					<button
						className="btn-sm btn-dark"
						title="Cancel the change"
						type="reset"
						onClick={() => dispatch(toggleMonthlyUpdateForm(monthly.id))}
					>
						<FontAwesomeIcon icon={faTimes}/>
					</button>
				</div>
				<textarea
					className="monthly-input"
					name="content"
					ref={register({ required: true })}
				/>

				{errors.content && <span className="error-text">This field is required.</span>}
			</form>
		</div>
	)
}

export default MonthlyEditable