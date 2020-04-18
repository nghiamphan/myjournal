import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { createJournal } from '../reducers/journalsReducer'

const generateId = (array) => {
	if (array.length === 0 || array[array.length-1].id === undefined) {
		return 0
	} else {
		return array[array.length-1].id + 1
	}
}

const padding = {
	padding: 12
}
const AddJournal = () => {
	const [bookSummaries, setBookSummaries] = useState([])
	const [todayWords, setTodayWords] = useState([])

	const { register, control, handleSubmit, errors } = useForm()

	const todosInputArray = useFieldArray({
		control,
		name: 'todos'
	})

	const dispatch = useDispatch()

	const addSummary = event => {
		event.preventDefault()
		setBookSummaries(bookSummaries.concat({
			id: generateId(bookSummaries),
			title: '',
			chapter: '',
			content: ''
		}))
	}

	const deleteSummary = id => {
		setBookSummaries(bookSummaries.filter(summary => summary.id !== id))
	}

	const handleSummariesChange = (id, property) => (event) => {
		const summary = bookSummaries.find(n => n.id === id)
		const updatedSummary = { ...summary }
		updatedSummary[property] = event.target.value
		setBookSummaries(bookSummaries.map(
			summary => summary.id !== id ? summary : updatedSummary)
		)
	}

	const addWord = event => {
		event.preventDefault()
		setTodayWords(todayWords.concat({
			id: generateId(todayWords),
			word: '',
			definition: '',
		}))
	}

	const deleteWord = id => {
		setTodayWords(todayWords.filter(word => word.id !== id))
	}

	const handleWordsChange = (id, property) => (event) => {
		const word = todayWords.find(n => n.id === id)
		const updatedWord = { ...word }
		updatedWord[property] = event.target.value
		setTodayWords(todayWords.map(
			word => word.id !== id ? word : updatedWord)
		)
	}

	const addJournal = data => {
		console.log('data', data)
		//event.preventDefault()
		const journalObject = {
			date: data.date,
			todos: data.todos.map((todo, index) => ({ ...todo, id: index })),
			reflection: data.reflection,
			book_summaries: bookSummaries,
			words_of_today: todayWords
		}
		dispatch(createJournal(journalObject))
	}
	return (
		<form onSubmit={handleSubmit(addJournal)}>
			<h2>Journal for Today</h2>

			<div>
				<h3>Date
					<input
						type="date"
						name="date"
						ref={register({ required: true })}/>
				</h3>
				{errors.date && <span>This field is required</span>}
			</div>

			<div>
				<h3>Todos</h3>
				<button
					onClick={event => {
						event.preventDefault()
						todosInputArray.append({})
					}}
				>
					add a task
				</button>
				<br/>

				{todosInputArray.fields.map((item, index) => (
					<div key={item.id}>
						<input
							type="checkbox"
							name={`todos[${index}].done`}
							ref={register()}
						/>
						<input
							name={`todos[${index}].task`}
							ref={register()}
						/>
						<button
							onClick={() => todosInputArray.remove(index)}
						>
							delete
						</button>
					</div>
				))}

			</div>


			<div>
				<h3>How is your day?</h3>
				<div>
					<textarea
						name="reflection"
						ref={register({ required: true })}
					/>
				</div>
				{errors.reflection && <span>This field is required</span>}
			</div>

			<div>
				<h3>Book Summaries</h3>
				<button onClick={addSummary}>add a summary</button> <br/>
				{bookSummaries.map(summary => (
					<div key={summary.id} style={padding}>
						<div>
							Title:
							<input
								value={summary.title}
								onChange={handleSummariesChange(summary.id, 'title')}/>
							Chapter:
							<input
								value={summary.chapter}
								onChange={handleSummariesChange(summary.id, 'chapter')}/>
						</div>
						<textarea
							placeholder="chapter summary and your thoughts..."
							value={summary.content}
							onChange={handleSummariesChange(summary.id, 'content')}/>
						<br/>
						<button onClick={() => deleteSummary(summary.id)}>delete</button>
					</div>
				))}
			</div>

			<div>
				<h3>Words of the day</h3>
				<button onClick={addWord}>add a word</button>
				{todayWords.map(word => (
					<div
						key={word.id}
						style={padding}>
						<input
							placeholder="Word"
							value={word.word}
							onChange={handleWordsChange(word.id, 'word')}/>
						<input
							placeholder="Definition..."
							value={word.definition}
							onChange={handleWordsChange(word.id, 'definition')}/>
						<button onClick={() => deleteWord(word.id)}>delete</button>
					</div>
				))}
			</div>

			<div style={padding}>
				<button type="submit">save</button>
			</div>

		</form>
	)
}

export default AddJournal