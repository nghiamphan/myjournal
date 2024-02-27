import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'

export const FirstAddButton = ({ inputArray, buttonText }) => (
	<button
		className="first-add-button btn-sm btn-dark"
		onClick={event => {
			event.preventDefault()
			inputArray.append({})
		}}
	>
		{buttonText}
	</button>
)

export const AddButton = ({ inputArray, index }) => (
	<button
		className="btn-sm btn-dark"
		title="Add a task"
		onClick={event => {
			event.preventDefault()
			inputArray.insert(index+1)
		}}
	>
		<FontAwesomeIcon icon={faPlus}/>
	</button>
)

export const DeleteButton = ({ inputArray, index }) => (
	<button
		className="btn-sm btn-dark"
		title="Delete the task"
		onClick={() => inputArray.remove(index)}
	>
		<FontAwesomeIcon icon={faTrash}/>
	</button>
)

export const MoveUpButton = ({ inputArray, index }) => (
	<button
		className="btn-sm btn-dark"
		title="Move up"
		onClick={event => {
			event.preventDefault()
			inputArray.swap(index, Math.max(0, index-1))
		}}
	>
		<FontAwesomeIcon icon={faArrowUp}/>
	</button>
)

export const MoveDownButton = ({ inputArray, index }) => (
	<button
		className="btn-sm btn-dark"
		title="Move Down"
		onClick={event => {
			event.preventDefault()
			inputArray.swap(index, Math.min(inputArray.fields.length-1, index+1))
		}}
	>
		<FontAwesomeIcon icon={faArrowDown}/>
	</button>
)

export const ItemButtons = ({ inputArray, index }) => (
	<div className="add-form-button-group">
		<MoveUpButton
			inputArray={inputArray}
			index={index}
		/>
		<MoveDownButton
			inputArray={inputArray}
			index={index}
		/>
		<AddButton
			inputArray={inputArray}
			index={index}
		/>
		<DeleteButton
			inputArray={inputArray}
			index={index}
		/>
	</div>
)