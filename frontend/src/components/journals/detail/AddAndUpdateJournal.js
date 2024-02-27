import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { createJournal, updateJournal, setDisplayedJournalId } from '../../../reducers/journalsReducer'
import { FirstAddButton, ItemButtons } from './buttons/JournalFormButtons'

const AddAndUpdateJournal = () => {
	const [error, setError] = useState(null)

	const journals = useSelector(state => state.journalsRedux.journals)
	const journalToUpdateId = useSelector(state => state.journalsRedux.journalToUpdateId)
	const journalToUpdate = journalToUpdateId ? journals.find(journal => journal.id === journalToUpdateId) : null

	const { register, control, handleSubmit, errors, watch } = useForm({
		defaultValues: journalToUpdate ? journalToUpdate : ''
	})

	const watchReflections = watch('reflections')

	const todosInputArray = useFieldArray({
		control,
		name: 'todos'
	})

	const reflectionsInputArray = useFieldArray({
		control,
		name: 'reflections'
	})

	const bookSummariesInputArray = useFieldArray({
		control,
		name: 'book_summaries'
	})

	const quotesInputArray = useFieldArray({
		control,
		name: 'quotes'
	})

	const todayWordsInputArray = useFieldArray({
		control,
		name: 'words_of_today'
	})

	const dispatch = useDispatch()

	const fieldMissingErrorText = () => <span className="error-text">This field is required.</span>

	const addAndUpdateJournal = data => {
		const duplicatedDate = updateJournal
			? journals.find(journal => journal.date === data.date && journal.id !== journalToUpdateId)
			: journals.find(journal => journal.date === data.date)
		if (duplicatedDate) {
			if (journalToUpdate) {
				setError(`A journal for ${data.date} already exists. Please choose another date for the edited journal.`)
			} else {
				setError(`A journal for ${data.date} already exists. If you want to edit the journal for ${data.date}, please choose update function instead.`)
			}
			setTimeout(setError, 5000, null)
			return
		}

		if (!(data.todos || data.reflections || data.book_summaries || data.quotes || data.words_of_today)) {
			setError('Journal has no content.')
			setTimeout(setError, 5000, null)
			return
		}

		const journalObject = {
			date: data.date,
			todos: data.todos ? data.todos : [],
			reflections: data.reflections ? data.reflections : [],
			book_summaries: data.book_summaries ? data.book_summaries : [],
			quotes: data.quotes ? data.quotes : [],
			words_of_today: data.words_of_today ? data.words_of_today : []
		}

		journalToUpdate
			? dispatch(updateJournal(journalToUpdateId, journalObject))
			: dispatch(createJournal(journalObject))
	}

	const onCancel = () => {
		journalToUpdate
			? dispatch(setDisplayedJournalId(journalToUpdateId))
			: dispatch(setDisplayedJournalId(journals[journals.length-1].id))
	}

	return (
		<div className="add-form-page">
			<form onSubmit={handleSubmit(addAndUpdateJournal)}>

				<div className="add-form-header detail-header flex-container">
					<div className="detail-header-button-group">
						<button
							className="btn btn-dark journal-save-button"
							type="submit"
						>
					Save
						</button>
						<button
							className="btn btn-dark journal-cancel-button"
							type="reset"
							onClick={onCancel}
						>
					Cancel
						</button>
					</div>
				</div>
				<span className="error-text">{error}</span>

				<div className="date-section">
					<label className="date-label h5">Date</label>
					<input
						className="journal-form-control date-input"
						type="date"
						name="date"
						ref={register({ required: true })}
					/>
				</div>
				{errors.date && fieldMissingErrorText()}

				<div className="todos-section">
					<h5>Todos</h5>
					{todosInputArray.fields.length === 0 &&
					<FirstAddButton
						inputArray={todosInputArray}
						buttonText="Add a task"
					/>
					}

					{todosInputArray.fields.map((item, index) => (
						<div className="flex-container" key={item.id}>
							<div className="add-todo-item">
								<input
									className="checkbox-input"
									type="checkbox"
									name={`todos[${index}].done`}
									ref={register()}
								/>
								<input
									className="journal-form-control task-input"
									placeholder="Write your todo here..."
									name={`todos[${index}].task`}
									ref={register({
										required: true,
										pattern: /[A-Za-z0-9]+/
									})}
								/>
							</div>

							<ItemButtons
								inputArray={todosInputArray}
								index={index}
							/>
						</div>
					))}

					{errors.todos && fieldMissingErrorText()}
				</div>


				<div className="reflections-section">
					<h5>Reflections</h5>
					{reflectionsInputArray.fields.length === 0 &&
					<FirstAddButton
						inputArray={reflectionsInputArray}
						buttonText="Add a reflection"
					/>
					}

					{reflectionsInputArray.fields.map((reflection, index) => (
						<div className="flex-container" key={reflection.id}>
							<div
								className="add-reflection-item"
								style={{ backgroundColor: watchReflections && watchReflections.length > index
									? watchReflections[index].color
									: '#ffebcd' }}
							>
								<textarea
									className="journal-form-control reflection-input"
									placeholder="How is your day?"
									name={`reflections[${index}].content`}
									ref={register({
										required: true,
										pattern: /[A-Za-z0-9]+/
									})}
								/>
							</div>

							<div style={{ alignSelf: 'center', marginBottom: 10 }}>
								<ItemButtons
									inputArray={reflectionsInputArray}
									index={index}
								/>
								Tag color&nbsp;
								<input
									type="color"
									style={{ borderRadius: '0.25rem' }}
									title="Choose a color for the reflection card"
									defaultValue="#ffebcd"
									name={`reflections[${index}].color`}
									ref={register()}
								/>
							</div>
						</div>
					))}

					{errors.reflections && fieldMissingErrorText()}
				</div>

				<div className="book-summaries-section">
					<h5>Book Summaries</h5>
					{bookSummariesInputArray.fields.length === 0 &&
					<FirstAddButton
						inputArray={bookSummariesInputArray}
						buttonText="Add a summary"
					/>
					}

					{bookSummariesInputArray.fields.map((summary, index) => (
						<div className="flex-container" key={summary.id}>
							<div className="add-book-summary-item">
								<input
									className="journal-form-control book-title-input"
									placeholder="Book title"
									name={`book_summaries[${index}].title`}
									ref={register({
										required: true,
										pattern: /[A-Za-z0-9]+/
									})}
								/>

								<input
									className="journal-form-control book-chapter-input"
									placeholder="Chapter"
									name={`book_summaries[${index}].chapter`}
									ref={register()}
								/>

								<textarea
									className="journal-form-control book-summary-input"
									placeholder="Chapter summary and your thoughts..."
									name={`book_summaries[${index}].content`}
									ref={register({
										required: true,
										pattern: /[A-Za-z0-9]+/
									})}
								/>
							</div>

							<ItemButtons
								inputArray={bookSummariesInputArray}
								index={index}
							/>
						</div>
					))}

					{errors.book_summaries && fieldMissingErrorText()}
				</div>

				<div className="quotes-section">
					<h5>Cool Quotes</h5>
					{quotesInputArray.fields.length === 0 &&
				<FirstAddButton
					inputArray={quotesInputArray}
					buttonText="Add a quotation"
				/>
					}

					{quotesInputArray.fields.map((quote, index) => (
						<div className="flex-container" key={quote.id}>
							<div className="add-quote-item">
								<textarea
									className="journal-form-control quote-content-input"
									placeholder="What interesting and insightful quotation you have come across today?"
									name={`quotes[${index}].content`}
									ref={register({
										required: true,
										pattern: /[A-Za-z0-9]+/
									})}
								/>

								<input
									className="journal-form-control quote-source-input"
									placeholder="Source"
									name={`quotes[${index}].source`}
									ref={register()}
								/>

								<textarea
									className="journal-form-control quote-comment-input"
									placeholder="Any comments you may have..."
									name={`quotes[${index}].comment`}
									ref={register()}
								/>
							</div>

							<ItemButtons
								inputArray={quotesInputArray}
								index={index}
							/>
						</div>
					))}

					{errors.quotes && fieldMissingErrorText()}
				</div>

				<div className="words-section">
					<h5>Words of the day</h5>
					{todayWordsInputArray.fields.length === 0 &&
					<FirstAddButton
						inputArray={todayWordsInputArray}
						buttonText="Add a word"
					/>
					}

					{todayWordsInputArray.fields.map((word, index) => (
						<div className="flex-container" key={word.id}>
							<div className="add-word-item">
								<input
									className="journal-form-control word-input"
									placeholder="Word"
									name={`words_of_today[${index}].word`}
									ref={register({
										required: true,
										pattern: /[A-Za-z0-9]+/
									})}
								/>
								<input
									className="journal-form-control definition-input"
									placeholder="Definition..."
									name={`words_of_today[${index}].definition`}
									ref={register({
										required: true,
										pattern: /[A-Za-z0-9]+/
									})}
								/>
							</div>

							<ItemButtons
								inputArray={todayWordsInputArray}
								index={index}
							/>
						</div>
					))}

					{errors.words_of_today && fieldMissingErrorText()}
				</div>

			</form>
		</div>
	)
}

export default AddAndUpdateJournal