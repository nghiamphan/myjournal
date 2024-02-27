import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateJournal } from '../../../../reducers/journalsReducer'

const Todo = ({ todo }) => {
	const dispatch = useDispatch()
	const journals = useSelector(state => state.journalsRedux.journals)
	const displayedJournalId = useSelector(state => state.journalsRedux.displayedJournalId)

	const toggleCheck = () => {
		const displayedJournal = displayedJournalId ? journals.find(journal => journal.id === displayedJournalId) : null
		const newTodo = { ...todo, done: !todo.done }
		const newTodos = displayedJournal.todos.map(n => n.id === todo.id ? newTodo : n)

		const updatedJournal = { ...displayedJournal,  todos: newTodos }
		dispatch(updateJournal(displayedJournalId, updatedJournal))
	}

	return (
		<div className="todo-item">
			<input
				className="checkbox-input"
				type="checkbox"
				checked={todo.done}
				onChange={toggleCheck}/>
			<label>{todo.task}</label>
		</div>
	)
}

export default Todo